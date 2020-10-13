<template>
  <div :class="{folder:true,readonly:readonly,focused:popupOpened}" v-if="folderData" @click.stop="open">
    <Ripple v-if="readonly"/>
    <div :class="{
      savingMarker:true, 
      ['material-icons-outlined']:true, 
      success:saving==2, 
      error:saving==3
    }" v-if="saving">
      {{ saving==1?'':saving==2?'done':'close' }}
    </div>

    <div class="material-icons-outlined icon" v-if="opened">folder_open</div>
    <div class="material-icons-outlined icon" v-else>folder</div>
    <input ref="input" :readonly="readonly" v-model="folderData.name" placeholder="[No Name]" @blur="save" @keydown.enter="save">
    <div class="functions">
      <VueButton icon="more_vert" :circle="true" :condition="newAwait" @click.stop="flag">
        <Flag :noPadding="true" v-if="popupOpened" @close="flag" @click.stop>
          <VueButton text="New folder" :row="true" :condition="flagAwait" @click.stop="flagSubmit('folder')"/>
          <VueButton text="New item" :row="true" :condition="flagAwait" @click.stop="flagSubmit('item')"/>
          <VueButton text="Rename" :row="true" @click.stop="flagSubmit('edit')"/>
          <VueButton text="Delete" :row="true" @click.stop="flagSubmit('delete')"/>
        </Flag>
      </VueButton>
    </div>
  </div>
  <div class="children" v-if="folderData && opened">
    <div class="e" v-if="folderData.subFolders.length == 0 && folderData.items.length == 0">
      <div class="material-icons-outlined icon">error_outline</div>
      <div>Empty folder</div>
    </div>
    <template v-else>
      <section v-for="subFolder in folderData.subFolders" :key="subFolder.id">
        <Folder :folder="subFolder"></Folder>
      </section>
      <section v-for="item in folderData.items" :key="item.id">
        <Item :item="item"></Item>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'
import VueButton from '@/components/VueButton.vue';
import Flag from '@/components/Flag.vue';
import Item from '@/components/Item.vue';
import Ripple from '@/components/ripple.vue';

interface FolderStructure{
  id?: number;
  name?: string;
  deck?: Object;
  subFolders?: Object[];
  parent_id?: number;
  items?: Object[];
}

@Options({
  props: {
    msg: String
  },
  components: { 
    Folder,
    VueButton,
    Flag,
    Item,
    Ripple
  },
  emits:[]
})
export default class Folder extends Vue {

  @Prop({}) folder:FolderStructure;

  popupOpened:boolean = false;
  newAwait:boolean|Promise<any> = false;
  folderData:FolderStructure = {};
  opened:boolean = false;
  readonly:boolean = true;
  opening:boolean|Promise<any> = false;
  saving:number = 0;
  previousValue:string = '0';

  mounted(){
    this.folderData = this.folder;
  }

  flag(){
    this.popupOpened = !this.popupOpened;
  }

  flagSubmit(context:"item"|"folder"|"edit"|"delete"){
    this.popupOpened = false;
    if(context == "edit"){
      this.readonly = false;
      (this.$refs.input as HTMLInputElement).focus()
      return;
    }
    if(context == "delete"){
      if(confirm("Are you sure you want to delete this folder and ALL its contents? WARNING: This action cannot be undone.")){
        this.saving = 1;
        this.$request.POST('folder/remove',{id:this.folderData.id},(folder)=>{
          console.log(folder);
          this.saving = 2;
          delete this.folderData;
        }).catch(err=>{
          this.saving = 3;
        })
      }
      return;
    }
    this.newAwait = new Promise((resolve,reject) => {
      let data = this.folderData;
      let relations = {};
      if(context == 'item'){
        relations['items'] = {
          name:"",
        }
      }else if(context == 'folder'){
        relations['subFolders'] = {
          name:"",
        }
      }
      console.log("submitting ",data,relations);
      
      this.$request.POST('folder/save',{data,relations},(folder)=>{
        console.log(folder);
        
        this.folderData = folder;
        resolve();
      }).catch(err=>{
        reject(err)
      })
    })
  }

  open(){
    if(!this.readonly) return;
    console.log("OPENING");
    
    this.opened = !this.opened;
    this.opening = new Promise((resolve,reject)=>{
      if(!this.folderData.subFolders && !this.folderData.items){
        this.$request.POST('folder/contents',this.folderData.id,(folder)=>{
          console.log("NEW CONTENT",folder);
          this.folderData = folder;
          resolve();
        }).catch(err=>{
          reject(err)
        })
      }
    })
  }

  async save(){
    if(this.saving > 0 || this.readonly) return;
    this.readonly = true;
    this.previousValue = this.folderData.name;
    this.saving = 1; 
    new Promise((resolve,reject) => {
      this.$request.POST("folder/save", this.folderData, ()=>{
        this.saving = 2;
        resolve();
        this.resetSave();
      }).catch(err => {
        this.saving = 3;
        this.folderData.name = this.previousValue;
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

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .folder{
    padding: 2px 5px 2px 15px;
    height: 30px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    border-radius: $radius;
    position: relative;
    *{
      vertical-align: top;
    }
    
    cursor: pointer;
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

  .children{
    padding-left: 15px;
    
    .e{
      height: 30px;
      line-height: 30px;
      padding-left: 15px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      column-gap: 10px;
      cursor: default;
    }
  }

  
  .icon{
    line-height: 30px;
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

</style>
