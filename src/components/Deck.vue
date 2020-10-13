<template>
  <div class="deck" @click="toggleOpen" v-if="tempDeck">
    <div class="header">
      <div class="loader">
        <template v-if="tempDeck.root_folders || tempDeck.root_items">
          <div class="material-icons large" :style="{transform:!open?`rotate(-90deg)`:''}">arrow_drop_down</div>
        </template>
        <template v-else>
          <div class="material-icons small">save_alt</div>
        </template>
      </div>
      <h4>{{ tempDeck.name }}</h4>
      <VueButton icon="add" :condition="newAwait" @click.stop="flag">
        <Flag v-if="popupOpened" @close="flag" @click.stop>
          <div class="">
            <VueButton text="Folder" :condition="flagAwait" @click.stop="flagSubmit('folder')"/>
          </div>
          <VueButton text="Item" :condition="flagAwait" @click.stop="flagSubmit('item')"/>
        </Flag>
      </VueButton>
    </div> 
    <section v-for="folder in tempDeck.root_folders" :key="folder.id">
      <Folder :folder="folder"></Folder>
    </section>
    <section v-for="item in tempDeck.root_items" :key="item.id">
      <Item :item="item"></Item>
    </section>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'
import VueButton from '@/components/VueButton.vue';
import Folder from '@/components/Folder.vue';
import Item from '@/components/Item.vue';
import Flag from '@/components/Flag.vue';

interface DeckStructure{
    id?: number;
    name?: string;
    root_folders?: Object[];
    root_items?: Object[];
}

@Options({
  props: {
    msg: String
  },
  components: { 
    Deck,
    VueButton,
    Folder,
    Item,
    Flag
  },
  emits:[]
})
export default class Deck extends Vue {
  @Prop({}) deckValue:DeckStructure;

  open:boolean = false;
  newAwait:boolean|Promise<any> = false;
  popupOpened:boolean = false;
  tempDeck:DeckStructure = {};

  mounted(){
    this.tempDeck = this.deckValue;
  }

  toggleOpen(){
    this.open = !this.open;
  }

  newData(){
    this.newAwait = false;
  }

  flag(){
    this.popupOpened = !this.popupOpened;
  }

  flagSubmit(context:"item"|"folder"){
    this.newAwait = new Promise((resolve,reject) => {
      let data = this.deckValue;
      let relations = {};
      if(context == 'item'){
        relations['root_items'] = {
          name:"Item child",
        }
      }else if(context == 'folder'){
        relations['root_folders'] = {
          name:"folder child",
        }
      }
      console.log("submitting ",data,relations);
      
      this.$request.POST('deck/save',{data,relations},(deck)=>{
        this.tempDeck = deck;
        resolve();
      }).catch(err=>{
        reject(err)
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .header{
    display: grid;
    grid-template-columns: auto 1fr auto;
  }
  .deck{
    cursor: pointer;
  }
</style>
