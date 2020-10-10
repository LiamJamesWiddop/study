<template>
  <NavBar></NavBar>
  <div id="page">
    <SearchBar>
      <div class="inputWrapper">
        <div class="material-icons">search</div>
        <input placeholder="Search" type="text" v-model="searchValue">
      </div>
    </SearchBar>
    <template v-if="d">
      <section v-for="(value,key) in d" :key="key">
        <template v-if="value">
          <template v-for="(data) in value">
            <section class="data" v-if="data && data.id" :key="data.id" @click="open(`editor`,key,data.id)">
              <div class="material-icons small">subdirectory_arrow_right</div>
              <div>{{key}} / {{ data.name || "[Unnamed]" }}</div>
              <ripple/>
            </section>
          </template>
        </template>
      </section>
    </template>
    <template v-else-if="dRAW">
      <section v-for="(value,key) in dRAW" :key="key">
        <div class="header" @click="toggleOpen(value)">
          <div class="loader">
            <template v-if="value">
              <div class="material-icons large" :style="{transform:!value.open?`rotate(-90deg)`:''}">arrow_drop_down</div>
            </template>
            <template v-else>
              <div class="material-icons small">save_alt</div>
            </template>
          </div>
          <h3>{{ key }}</h3>
          <VueButton :text="`New`" :condition="value.await" @click.stop="newData(key,value)"/>
        </div> 
        <template v-if="value && value.open">
          <template v-for="(data) in value.data">
            <section class="data" v-if="data && data.id" :key="data.id" @click="open(`editor`,key,data.id)">
              <div class="material-icons small">subdirectory_arrow_right</div>
              <div>{{ data.name || "[Unnamed]" }}</div>
              <div class="material-icons" v-if="data.flags.length">outlined_flag</div>
              <ripple/>
            </section>
          </template>
        </template>
        <template v-else-if="!value">Loading data...</template>
      </section>
    </template>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'

import VueButton from '@/components/VueButton.vue';
import NavBar from '@/components/NavBar.vue';
import SearchBar from '@/components/SearchBar.vue';
import ripple from '@/components/ripple.vue';

@Options({
  components: { 
    VueButton,
    NavBar,
    ripple,
    SearchBar
  },
})
export default class Data extends Vue { 

  dRAW:Object = {}
  d:Object = {}
  
  diagnostics:any[] = [];
  diseaseAwait:Promise<any> | boolean = false;
  drugAwait:Promise<any> | boolean = false;
  loading:boolean = true;

  searchValue:string = '';

  mounted(){
    this.getData();
  }

  toggleOpen(entry){
    entry.open = !entry.open;
  }

  async getData(){ 
    this.dRAW = await this.$request.POST(`database/find`, {tables:['disease','drug','nondrug','diagnostic','symptom','sign'],data:{select:['id','name']},flags:true}, (res)=>{});
    for(let [key,item] of Object.entries(this.dRAW)){
      this.dRAW[key] = {data: [...item], await:undefined, open:true};
    }
    this.search('');
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
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
    cursor: pointer;
  }

  section.data{
    display: grid;
    grid-template-columns: auto 1fr auto;
    column-gap: 10px;
  }

</style>
