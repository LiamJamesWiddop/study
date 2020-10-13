<template>
  <div :class="{item:true,readonly:readonly,focused:popupOpened}" @click="open(`editor`,item.table,item.id)">
    <Ripple v-if="readonly"/>
    <div :class="{
      savingMarker:true, 
      ['material-icons-outlined']:true, 
      success:saving==2, 
      error:saving==3
    }" v-if="saving">
      {{ saving==1?'':saving==2?'done':'close' }}
    </div>
    <div class="material-icons-outlined icon">login</div>
    <input ref="input" :readonly="readonly" v-model="item.name" placeholder="[Untitled]" @blur="save" @keydown.enter="save">
    <div class="functions">
      <VueButton icon="more_vert" :circle="true" :condition="newAwait" @click.stop="flag">
        <Flag :noPadding="true" v-if="popupOpened" @close="flag" @click.stop>
          <div class="header">
          </div>
          <div class="row">
            <VueButton text="Rename" :row="true" @click.stop="flagSubmit('edit')"/>
          </div>
        </Flag>
      </VueButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'
import VueButton from '@/components/VueButton.vue';
import Flag from '@/components/Flag.vue';
import Ripple from '@/components/ripple.vue';

interface ItemStructure{
  id: number;
  name: string;
  deck: Object;
  table: Object;
  entries: Object[];
  folder: Object; 
}

@Options({
  props: {
    msg: String
  },
  components: { 
    Item,
    VueButton,
    Flag,
    Ripple
  },
  emits:[]
})
export default class Item extends Vue {

  @Prop({}) item:ItemStructure;

  popupOpened:boolean = false;
  readonly:boolean = true;
  previousValue:string = "";
  saving:number = 0; //0 = none; 1 = loading; 2 = success; 3 = fail

  flag(){
    this.popupOpened = !this.popupOpened;
  }

  flagSubmit(context:"item"|"folder"|"edit"){
    this.popupOpened = false;
    if(context == "edit"){
      this.readonly = false;
      (this.$refs.input as HTMLInputElement).focus()
      return;
    }
  }

  async save(){
    if(this.saving > 0 || this.readonly) return;
    this.readonly = true;
    this.previousValue = this.item.name;
    this.saving = 1; 
    new Promise((resolve,reject) => {
      this.$request.POST("item/save", this.item, ()=>{
        this.saving = 2;
        resolve();
        this.resetSave();
      }).catch(err => {
        this.saving = 3;
        reject(err)
        this.resetSave();
      })
    })    
  }

  resetSave(){
    setTimeout(()=>{
      this.saving = 0;
    },1000)
  }

  open(name,form,id){
    if(this.saving > 0 || !this.readonly) return;
    this.$router.push({name,params:{form,id}});
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .item{
    padding: 2px 5px 2px 15px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    border-radius: $radius;
    cursor: pointer;
    position: relative;

    *{
      vertical-align: top;
    }

    .savingMarker{
      position: absolute;
      left:10px;
      bottom: 0px;
      top: 0px;
      margin: auto;
      border-radius: 50%;
      background: $prim;
      width: 20px;
      height: 20px;
      color: #fff;
      line-height: 20px;
      font-size: 13px;
      text-align: center;
      animation: pulse 0.7s ease-in-out infinite reverse;

      &.success{
        background: $green;
        animation: none;
      }
      &.error{
        background: $red;
        animation: none;
      }
    }

    .icon{
      line-height: 30px;
      vertical-align: top;
    }

    box-shadow: inset 0px 0px 0px 2px $prim;
    &.readonly{
      box-shadow: none;
      input{
        cursor: pointer;
      }
    }

    &:hover,&.focused{
      background: $lightGrey;
      .functions{
        display: block;
      }
    }

    input{
      background: transparent;
      line-height: 30px;
      vertical-align: top;
    }

    box-shadow: inset 0px 0px 0px 2px $prim;
    &.readonly{
      box-shadow: none;
      input{
        cursor: pointer;
      }
    }

    .functions{
      display: none;
      vertical-align: top;
    }
  }

</style>
