import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module({ 
  namespaced:true, 
  stateFactory: true,
})
export default class databaseStore extends VuexModule {
  
  databaseEntries:Array<any> = []
  dbState = []

  @Mutation
  async find({promise,payload,callback}){
    this.databaseEntries = await promise;
    let dbState = []
    for(let [key,entries] of Object.entries(this.databaseEntries)){
      let e = entries as Array<any>;
      for(let i=0; i<e.length; i++){
        e[i] = {...e[i], table:key}
        dbState.push(e[i]);
      }
    }
    if(dbState.length == 0){
      dbState = [{table:'',name:'ERROR'}]
    }
    this.dbState = dbState;
    callback(this.dbState);
  }
}