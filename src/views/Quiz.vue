<template>
  <NavBar></NavBar>
  <div id="page">
    <template v-if="view && view == 'questions'">
      <SearchBar>
        <div>
          <h5>Question {{questionNumber}}</h5>
          <PerformanceBar :correct="correct" :incorrect="incorrect" :ratio="ratio"/>
        </div>
        <div class="buttons" v-if="showAnswer">
          <VueButton text="Correct (space)" @click="correctAnswer"></VueButton>
          <VueButton text="Incorrect (ctrl + space)" @click="incorrectAnswer"></VueButton>
        </div>
        <div class="buttons" v-else>
          <VueButton text="Show answer (space)" @click="showAnswer = true"></VueButton>
        </div>
      </SearchBar>
      <section class="question">
        <template v-if="question && question.question_id">
          <Question v-if="question.question_id" :values="question.body" :showAnswer="showAnswer"/>
        </template>
        <template v-else-if="question">
          Retrieving question
        </template>
        <template v-else>
          No question
        </template>
      </section>
    </template>

    <template v-if="!view">
      <section>
        <div class="header">
          <h3>Quiz home</h3>
        </div>
      </section>
      <section>
        <div class="body">
          <Input label="Number of questions"/>
          <Input label="Topic"/>
        </div>
      </section>
      <section>
        <VueButton text="Start a quiz" @click="open('quiz',{view:'questions'})"/>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import VueButton from '@/components/VueButton.vue';
import NavBar from '@/components/NavBar.vue';
import PerformanceBar from '@/components/PerformanceBar.vue';
import Question from '@/components/Question.vue';
import Editable from "@/components/Editable.vue"
import Input from "@/components/Input.vue"
import SearchBar from "@/components/SearchBar.vue"
import {Not} from "typeorm"

@Options({
  components: { 
    VueButton,
    NavBar,
    Question,
    PerformanceBar,
    Input,
    SearchBar
  },
})
export default class Quiz extends Vue { 
  
  dbState:Array<any> = [];
  view:string|string[] = '';
  active:number = -1;
  question:any = {};
  nextQuestion:any = {};
  retrievingNextQuestion:boolean = false
  searchFailLimit:number = 0;
  questionNumber:number = 0;
  showAnswer:boolean = false;
  spaceReleased:boolean = true;
  canProceed:boolean = true;

  correct:number = 0;
  incorrect:number = 0;
  ratio:number = 0;

  mounted(){
    this.init();
    this.events();
  }

  @Watch('$route.params')
  getParams(){
    this.question = {};
    this.view = this.$route.params.view;
    this.init();
  }

  events(){
    document.addEventListener('keyup',async (e)=>{
      if(e.which == 32) this.spaceReleased = true;
    })
    document.addEventListener('keydown',async (e)=>{
      if(this.view == "questions"){ 
        if((e.which == 32) && this.spaceReleased){
          this.spaceReleased = false;
          if(this.showAnswer){
            if(this.retrievingNextQuestion){
              alert("Waiting on next question");
              return;
            }else{
              if(e.ctrlKey){
                this.incorrectAnswer()
              }else{
                this.correctAnswer();
              }
            }
          }else{
            this.showAnswer = true;
          }
        }
      }
    })
  }

  correctAnswer(){
    this.correct++;
    this.saveAnswer(true);
  }

  incorrectAnswer(){
    this.incorrect++;
    this.saveAnswer(false);
  }

  async saveAnswer(correct){
    this.$request.POST(`question/questionAttempt`,{
        question_id:this.question.question_id,
        correct:correct,
        question:this.question.question,
        nextAttemptDelta:this.question.nextAttemptDelta
    },()=>{})
    this.question = false;
    setTimeout(()=>{
      this.showNextQuestion();
    },10)
  }

  async init(){   
    if(this.view == "questions"){ 
      await this.getDbState();
      this.nextQuestion = this.getNextQuestion();
      this.showNextQuestion();
    }
  }

  async getDbState(){
    await this.$request.POST("database/find", {tables:['disease','drug','nondrug','diagnostic','symptom','sign'],data:{select:['id','name']}},(res)=>{
      this.dbState = res;
    });
  }

  async showNextQuestion(){
    this.showAnswer = false;
    this.question = await this.nextQuestion;
    this.nextQuestion = this.getNextQuestion();
  }

  async getNextQuestion(){
    console.log("getting next");
    this.nextQuestion = undefined;
    let ignoreId;
    if(this.question && this.question.question_id){
      ignoreId = this.question.question_id;
    }
    this.retrievingNextQuestion = true;
    let questionArray = await this.$request.POST('question/getBest',ignoreId,()=>{})
    this.retrievingNextQuestion = false;
    console.log("retrieved",questionArray[0]);
    
    return questionArray[0];
  }

  randomEntryField(entry,exceptThis){
    let entryObject = Object.entries(entry);
    let length = entryObject.length - 1;
    let start = Math.round(Math.random() * length);
    let index = start==length?0:start+1;
    
    let chosen:string|boolean = false;
    let none = false;
    
    while(!chosen && !none){
      let [key,value] = entryObject[index];
      if(key!="id" && key!="name" && key != exceptThis){
        if(value){
          chosen = key;
        } 
      }
      if(index == start){
        none = true;
      }
      
      index++
      if(index > length){
        index = 0;
      }
    }
    if(none){
      return false;
    }else{
      return chosen;
    }
  }

  newQuiz(number){
    let randomEntries = this.randomEntries(number);
    this.createQuiz(randomEntries);
  }

  randomEntries(number){
    let entriesTemp = this.dbState;
    let includedEntries = [];
    let covered = [];
    
    for(let i=0;i<number;){
      let index = Math.round(Math.random() * this.dbState.length);
      if(entriesTemp[index]){
        let entry = entriesTemp[index];
        includedEntries.push({
          entry_id:entry.id,
          table:entry.table,
        });
        i++
      }
    }
    return includedEntries;
  }

  createQuiz(randomEntries){
    this.$request.POST(`quiz/new`,{question:randomEntries, time: new Date().getTime()},(res)=>{
      this.open(`quiz`,{view:'questions',id:res.id});
    })
  }

  async removeQuestion(question){
    this.$request.POST(`quizquestion/remove`,question,(res)=>{
      console.log("REMOVED",res);
    })
    await this.getNextQuestion();
  }

  save(question){
    this.$request.POST(`quizquestion/save`,question,(res)=>{
      console.log("SAVED",res);
    })
  }

  open(name,params){
    this.$router.push({name,params:params});
  }  
}
</script>

<style lang="scss" scoped>
.header{
  padding: 15px 0px 20px;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  background: #ffffff;
  border-bottom: 1px solid $grey;
}

.buttons{
  height: 30px;
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 10px;
}

.question{
  padding-top: 40px;
}

@media only screen and (max-width: 400px) {
  .buttons{
    padding: 18px 0px;
    border-top: 1px solid $grey;
    background: #fff;
    position: fixed;
    bottom: 0px;
    left: 25px;
    right:25px;
    z-index: 9;
  }
  .question{
    padding-bottom: 81px;
  }
}
</style>
