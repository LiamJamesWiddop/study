<template>
  <div class="InformationPopup" ref="popup" :style="coordsValue" @click.stop>
    <template v-if="dataFull">
      <div class="meta">
        <h5 v-if="table">{{ this.table.toUpperCase() }}</h5>
        <div>
          <VueButton icon="exit_to_app" text="Open" @click.stop="open(`editor`,this.table,dataFull.id)"/>
        </div>
      </div>
      <template v-for="(data,field) in (dataFull || dataTemp)" :key="field">
        <div v-if="typeof data == 'string'">
          <div class="row" v-if="typeof data == 'string' && field !== 'table'">
            <h3 v-if="field == 'name'">{{ data }}</h3>
            <template v-else>
              <h5 class="field">{{field.toUpperCase()}}:</h5>
              <div class="data" v-html="data"></div>
            </template>
          </div>
        </div>
      </template>  
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'

import VueButton from "@/components/VueButton.vue"
import Editable from "./Editable.vue"

@Options({
  props: {
    msg: String
  },
  components: { 
    InformationPopup,
    VueButton
  },
  emits:['setPopupData']
})
export default class InformationPopup extends Vue {
  @Prop({})popupData:any
  @Prop({})coords:{
    left:number,
    top:number
  }

  coordsValue:{
    left?:string,
    top?:string
    right?:string
    bottom?:string
  } = {}
  table:string = "";
  dataTemp:any = "";
  dataFull:any = "";
  dbState:Array<any> = [];

  mounted(){
    this.init();
    this.docEvents();
  }

  @Watch('popupData')
  async init(){
    await this.getTable();
    this.reposition();
  }

  docEvents(){
    document.addEventListener('click',this.close)
  }

  close(){
    this.setPopupData(false)
  }

  reposition(){
    this.coordsValue = {}
    let rect = (this.$refs.popup as HTMLDivElement).getBoundingClientRect();
    console.log(this.coords.left, rect.width , window.innerWidth);

    if(this.coords.top + rect.height > window.innerHeight){
      this.coordsValue.bottom = `10px`;
    }else this.coordsValue.top = `${this.coords.top}px`
    if(this.coords.left + rect.width > window.innerWidth){
      this.coordsValue.right = `10px`;
    }else this.coordsValue.left = `${this.coords.left}px`
  }

  beforeUnmount(){
    document.removeEventListener('click',this.close)
  }
  
  updated(){
    let d = (this.$refs.popup as HTMLElement).getElementsByClassName('inlineMarker');
    for(let marker of d){
      Editable.prototype.addEvents(marker as HTMLDivElement, false, this.open);
    }
  }

  open(name,form,id){
    this.$router.push({name,params:{form,id}});
    this.setPopupData(false);
  } 

  async getTable(){
    this.dataFull = undefined;
    this.table = this.popupData.table;
    this.dataTemp = this.popupData;
    await this.getData();
    await this.getDbState();
    this.replacePlaceholders();
  }

  async getData(){
    return new Promise((resolve,reject) => {
      this.$request.POST(`${this.dataTemp.table}/findOne`,{id:this.dataTemp.id}, (res)=>{
        if(res){
          this.dataFull = res;
          resolve();
        }
      })
    })
  }

  replacePlaceholders(){
    for(let [key,field] of Object.entries(this.dataFull)){
      if(typeof field == "string"){
        if(this.dbState.length > 0){
          field = Editable.prototype.replacePlaceholders(field,this.dbState);
          this.dataFull[key] = field;
        }else{
          alert('state not set');
        }
      }
    }
  }

  async getDbState(){
    this.dbState = this.$store.state['database'].dbState;
  }

  @Emit("setPopupData")
  setPopupData(value){
    return value;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@keyframes enter {
  0%{
    transform: translate3d(0px, 10px, 0px);
  }
  100%{
    transform: translate3d(0px, 0px, 0px);
  }
}
.InformationPopup{
  position: fixed;
  background: white;
  box-shadow: $lightShadow;
  padding: 15px;
  border-radius: $radius;
  width: 300px;
  max-width: 100vw;
  transition: all 0.25s $cubic;
  animation: enter 0.25s $cubic;
  z-index: 9;
  .meta{
    display: grid;
    grid-template-columns: 1fr auto;
  }
  .row{
    margin-bottom: 10px;
    .field{
      font-weight: 700;
    }
    .data{
      max-height: 3em;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
