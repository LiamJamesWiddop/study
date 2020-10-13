<template>
  <NavBar></NavBar>
  <div id="page" :class="{content:$route.params.id}">
    <SearchBar>
      <div class="inputWrapper">
        <div class="material-icons">search</div>
        <input placeholder="Search" type="text" v-model="searchValue">
      </div>
      <VueButton :text="`New deck`" @click="newDeck"/>
    </SearchBar>
    <template v-if="decks && decks[0] && decks[0].id">
      <section v-for="deck in decks" :key="deck.id">
        <Deck :deckValue="deck"></Deck>
      </section>
    </template>
    <template v-else>
      No decks
    </template>
  </div>
  <div id="editor">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'

import Deck from '@/components/Deck.vue';
import NavBar from '@/components/NavBar.vue';
import SearchBar from '@/components/SearchBar.vue';
import ripple from '@/components/ripple.vue';
import VueButton from '@/components/VueButton.vue';

@Options({
  components: { 
    Deck,
    NavBar,
    ripple,
    SearchBar,
    VueButton
  },
})
export default class Data extends Vue { 

  decks:Object = {};

  dRAW:Object = {}
  d:Object = {}
  
  diagnostics:any[] = [];
  diseaseAwait:Promise<any> | boolean = false;
  drugAwait:Promise<any> | boolean = false;
  loading:boolean = true;

  searchValue:string = '';

  mounted(){
    this.getDecks();
  }

  toggleOpen(entry){
    entry.open = !entry.open;
  }

  async getDecks(){ 
    this.decks = await this.$request.POST(`deck/find`, {}, (res)=>{});
    console.log("DECK",this.decks);
  }

  async newDeck(){ 
    this.dRAW = await this.$request.POST(`deck/new`, {
      name:"Trial"
    }, (res)=>{});
    console.log("DECK",this.dRAW);
  }

  open(name,form,id){
    this.$router.push({name,params:{form,id}});
  }

  newData(table,metaData){
    metaData.await = new Promise((resolve, reject)=>{
      this.$request.POST(`${table}/new`, {}, (res)=>{
        metaData.data = res;
        resolve();
        this.open(`editor`,table,res.id);
        return res;
      });
    });
  }

  @Watch('searchValue')
  search(to){
    this.d = undefined;
    if(this.searchValue.trim().length > 0){
      for(let [key,table] of Object.entries(this.dRAW)){
        table.data.find(element => {
          if(element.name && element.name.toLowerCase().includes(this.searchValue.toLowerCase())){
            if(!this.d) this.d = {};
            if(this.d[key]) {
              this.d[key].push(element)
            }else {
              this.d[key] = [element]
            }
          }
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .header{
    padding: 15px 0px 20px;
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 20px;
    background: #ffffff;
  }

  .content{
    position: absolute;
    left:0;
    right:auto;
    width: 300px;
  }

  #editor{
    position: absolute;
    left: 400px;
    right: 50px;
  }

</style>
