<template>
  <h4 class="question" ref="questionWrapper">
    {{ values.question }}
  </h4>
  <div class="body" ref="questionWrapper" v-html="values.body"></div>
  <div class="answer" v-if="showAnswer">
    <div class="material-icons">subdirectory_arrow_right</div>
    <div v-html="values.answer"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'
import Editable from "./Editable.vue"

@Options({
  props: {
    msg: String
  },
  components: { 
    Question,
  },
  emits:['save','empty']
})
export default class Question extends Vue {
  @Prop({}) values:any;
  @Prop({}) showAnswer:boolean;
  dbState;

  mounted(){
    this.dbState = this.$store.state['database'].dbState;
    this.getPlaceholders()
  }

  getPlaceholders(){
    console.log("GET PLACEHOLDERS");
    
    this.values.body = Editable.prototype.replacePlaceholders(this.values.body,this.dbState);
    this.values.answer = Editable.prototype.replacePlaceholders(this.values.answer,this.dbState);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .answer{
    padding-top: 30px;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;;
  }

  .body{
    padding-top: 10px;
  }

</style>
