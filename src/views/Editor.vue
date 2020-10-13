<template>
  <SearchBar>
    <div class="inputWrapper">
      <div class="material-icons">outlined_flag</div>
      <input placeholder="Search" type="text">
    </div>
    <div class="field">
      <div>
        <VueButton text="Flag" icon="outlined_flag" :condition="deleteAwait" @click.stop="flag">
          <Flag v-if="flagOpened" @close="flag" @click.stop>
            <Input label="Text" :multi="true" @input="flagText =  $event.target.value"/>
            <VueButton text="Submit" :condition="flagAwait" @click.stop="flagSubmit"/>
          </Flag>
        </VueButton>
      </div>
    </div>
  </SearchBar>
  <template v-if="dataObject"> 
    <h5 class="table" v-if="form">EDIT {{ form.toUpperCase() }}</h5>
    <template v-for="(value,field) in dataObject" :key="field">
      <Editable 
      v-if="typeof value == 'string' && dbState.length > 0" 
      :autoFill="dbState" 
      :fieldName="field" 
      :value="value" 
      @update="update($event,field)"
      @autoFillChosen="autoFillChosen"
      @setPopupData="setPopupData"
      @setPopupCoords="setPopupCoords"></Editable>
      <div class="relations" v-else-if="typeof value == 'object'"> 
        <h5>{{ field.toUpperCase() }}</h5>
        <div v-for="(a,index) in value" :key="index" @click="this.open(`editor`,field,a.id)"> {{a.name}} </div>
      </div>
    </template>

    <div id="footer">
      <div></div>
      <VueButton text="Delete" @click="del" :condition="deleteAwait"/>
      <VueButton text="Save" @click="save" :condition="saveAwait"/>
    </div>

    <InformationPopup v-if="popupData" :coords="popupCoords" :popupData="popupData" @setPopupData="setPopupData"/>
  </template>
  <template v-else-if="loading">
      <div class="relations"> 
        Loading data...
      </div>
  </template>
  <template v-else>
      <div class="relations"> 
        No data for this registry
      </div>
  </template>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import VueButton from '@/components/VueButton.vue';
import NavBar from '@/components/NavBar.vue';
import Editable from '@/components/Editable.vue';
import { Watch } from 'vue-property-decorator';
import InformationPopup from "@/components/informationPopup.vue";
import SearchBar from "@/components/SearchBar.vue";
import Flag from "@/components/Flag.vue";
import Input from "@/components/Input.vue";

@Options({
  components: { 
    VueButton,
    NavBar,
    Editable,
    InformationPopup,
    SearchBar,
    Flag,
    Input
  },
  emits:['update']
})
export default class Editor extends Vue { 
    form:any = false;
    dataId;
    deleteAwait?:Promise<any> | boolean = false;
    saveAwait?:Promise<any> | boolean = false;
    flagAwait?:Promise<any> | boolean = false;
    dataObject:Object = {};
    loading:boolean = false;
    dbState:Array<any> = []
    popupData:Object|boolean = false
    flagOpened:boolean = false;
    popupCoords:{left?:number,top?:number} = {}
    flagText:string = "";

    textUpdate(){
      console.log('fdsfds',this.flagText);
    }

    mounted(){
      this.init();
      this.getDbState();
      this.getData();
      this.globalEvents();
    }

    globalEvents(){
      let html = document.documentElement;
      html.onkeydown = (e)=>{
        if(e.ctrlKey){
          if(e.which == 83){
            this.save();
            e.preventDefault();
            return false;
          }
        }
      }
    }

    @Watch('$route.params')
    async init(){
      this.dataObject = {};
      this.loading = true;
      this.setDataVars();
      this.setPopupData(false);
      await this.getData();
    }

    setDataVars(){
        this.form = this.$route.params.form;
        this.dataId = this.$route.params.id;
    }
    async getData(){
      await new Promise((resolve,reject)=>{
        this.$request.POST(`${this.form}/findOne`,{id:this.dataId},(res)=>{
            this.dataObject = res;
            resolve();
        })
      })
    }

    setPopupCoords(coords){
      this.popupCoords = coords;
    }
    setPopupData(data){
      this.popupData = data;
    }
    async save(){
      this.parseInlineMarkers();
      this.saveAwait = new Promise((resolve,reject)=>{
        this.$request.POST(`${this.form}/save`, this.dataObject, async (res)=>{
          await this.createQuestions(this.form,res)
          resolve();
        })
      })
      await this.saveAwait;
    }
    del(){
      this.parseInlineMarkers();
      if(confirm(`Are you sure you want to delete this ${this.form}? All its associations and quiz progress will be lost forever`)){
        this.deleteAwait = new Promise((resolve,reject)=>{
          this.$request.POST(`${this.form}/remove`, this.dataObject, (res)=>{
            resolve();
          })
        })
      }
    }
    async createQuestions(table,dataObject){
      let fields = [];
      for(let [key, value] of Object.entries(dataObject)){
        if(key !== 'id' && typeof value !== "object"){
          fields.push(key);
        }
      }
      let data = {
        table: table,
        entry_id: dataObject.id,
        fields:fields
      }

      await this.$request.POST(`question/createQuestions`, data, (res)=>{
        console.log("RES",res);
      })
      console.log("Finishing createQuestions");
    }

    parseInlineMarkers(){
      let tmp = document.createElement('div');
      for(let [key, value] of Object.entries(this.dataObject)){
        if(typeof value == "string"){
          tmp.innerHTML = value;
          this.searchElement(tmp)
          this.dataObject[key] = tmp.innerHTML;
        }
      }
    }

    searchElement(element:Element){
      let index = 0;
      let markersToCheck = true;
      let markers = element.children;
      while(markersToCheck && index < 50){
        if(!markers[index]){
          markersToCheck = false;
        }else if(markers[index].className == "inlineMarker"){
          let marker = markers[0]
          let id = (marker as HTMLElement).dataset.id;
          let table = (marker as HTMLElement).dataset.table;
          let text = document.createTextNode(`{{${table}_${id}}}`);
          element.replaceChild(text,marker);
        }else if(element.children){
          for(let child of element.children){
            this.searchElement(child);
          }
        }
        index++;
      }
    }

    autoFillChosen(autoFillObject){
      if(this.dataObject[autoFillObject.table]){
        this.dataObject[autoFillObject.table].push(autoFillObject);
      }else{
        this.dataObject[autoFillObject.table] = [autoFillObject];
      }
    }

    update(newValue,field){ 
      if(typeof this.dataObject[field] == "object"){
        this.dataObject[field] = this.dataObject[field] || {};
        this.dataObject[field]['value'] = newValue;
      }else this.dataObject[field] = newValue;
    }

    async getDbState(){
      this.$request.POST("database/find", {tables:['disease','diagnostic','drug','nondrug','sign','symptom'],data:{select:['name','id']}},()=>{
        this.dbState = this.$store.state['database'].dbState;
        this.loading = false;
      });
    }

    open(name,form,id){
      this.$router.push({name,params:{form,id}});
    }    

    flag(){
      this.flagOpened = !this.flagOpened;
    }

    flagSubmit(){
      this.flagAwait = new Promise((resolve,reject) => {
        console.log(this.flagText);
        
        if(this.flagText){
          this.$request.POST('flag/new', {
            table: this.form,
            entry_id: this.dataObject['id'],
            text:this.flagText,
            time:new Date().getTime()
          }, (res)=>{
            console.log("Flag saved", res);
            resolve()
          }).catch(err => {
            reject(err)
          })
        }else{
          console.log("NO TEXT");
          reject();
        }
      })
    }
}
</script>

<style lang="scss">


.table{
  padding-top: 20px;
  margin: 0px;
  padding-bottom: 20px;
}
.relations{
  padding-top: 15px;
  margin-bottom: 15px;
  div{
    cursor: pointer;
    &:hover{
      color:$prim;
    }
  }
}

#footer{ 
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-column-gap: 15px;
}
</style>
