<template>
  <div v-if="fieldName == 'name'"  class="body">
    <h5>{{ fieldName.replace(/([a-z])([A-Z])/g, '$1 $2') }}</h5>
    <h3 ref="input" class="textField" contenteditable="true" @keyup="keyPress"></h3>
  </div>
  <div class="body" v-else-if="fieldName !== 'id' && !fieldName.includes('relations')">
    <h5>{{ fieldName.replace(/([a-z])([A-Z])/g, '$1 $2') }}</h5>
    <div class="textField" ref="input" contenteditable="true" @keydown="keyPress" @keyup="keyPress"></div>
    <AutoFill v-if="autoFillValues && autoFillValues.length > 0" :autoFillIndex="autoFillIndex" :values="autoFillValues" @choose="autoFillChosen"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'
import AutoFill from "./autofill.vue";
import fs from "fs"

@Options({
  props: {
    
  },
  components: { 
    Editable,
    AutoFill,
  },
  emits:['update','auto-fill-chosen','autoFillChosen','setPopupCoords','setPopupData']
})
export default class Editable extends Vue {
  @Prop({}) fieldName: String;
  @Prop({}) value: any;
  @Prop({}) autoFill: any;
  
  valueDefault:string|number|object = "";
  newValue:string|number|object = "";
  valuesMap:Map<any,any>|undefined = undefined;
  autoFillValues:Object[]|boolean = false;
  autoFillIndex:number=-1;
  placeholdersSet:boolean=false;

  mounted(){
    this.replacePlaceholders();
    this.insertHTML();
  }

  open(name,form,id){
    this.$router.push({name,params:{form,id}});
    this.closeAll();
  } 

  insertHTML(){
    if(typeof this.valueDefault == "string"){
      (this.$refs.input as HTMLElement).innerHTML = this.valueDefault;
    }
    let d = document.getElementsByClassName('inlineMarker');
    for(let marker of d){
      this.addEvents(marker as HTMLDivElement);
    }
  }

  addEvents(marker:HTMLDivElement, noMouseOver:boolean = true, open:Function = this.open){
    marker.addEventListener('click', (e)=>{
      e.stopPropagation()
      let rect = (e.srcElement as HTMLElement).getBoundingClientRect();
      let coords = {
        left: rect.left,
        top: rect.top + rect.height
      }
      this.setPopupCoords(coords);
      this.display(e)
    })
  }

  closeAll(){
    this.setPopupData(false);
    this.autoFillValues = false;
  }

  @Emit("setPopupData")
  setPopupData(value){
    return value;
  }
  @Emit("setPopupCoords")
  setPopupCoords(value){
    return value;
  }

  @Emit("update")
  keyPress(e?){
    this.newValue = (this.$refs.input as HTMLElement).innerHTML;
    if(e){
      if(e.type=="keyup" && this.autoFillIndex>=0){
        e.preventDefault();
        return this.newValue;
      }
      if(e.which == 38){
        this.autoFillIndex--
        this.autoFillIndex = Math.max(0,this.autoFillIndex);
        e.preventDefault();
        return this.newValue;
      }else if(e.which == 40){
        this.autoFillIndex++;
        this.autoFillIndex = Math.min((this.autoFillValues as Object[]).length-1,this.autoFillIndex);
        e.preventDefault();
        return this.newValue;
      }
  
      if(e.which == 13 && this.autoFillIndex >= 0){
        this.autoFillChosen(this.autoFillValues[this.autoFillIndex]);
        this.autoFillIndex = -1; 
        e.preventDefault();
        return this.newValue;
      }

      if(e.which == 32 || e.which == 13){
        this.closeAll();
      }else if(this.placeholdersSet){
        this.pdi();
      }
    }else{
        this.closeAll();
    }

    return this.newValue;
  }


  urltoFile(url, filename, mimeType){
      return (fetch(url)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], filename,{type:mimeType});})
      );
  }
  
  pdi(){
    // PDI = check for: Presentations, Diagnostics, and Interventions
    let word:string = this.getWord().trim();
    if(word){
        this.autoFillValues = this.getAutoFill({
          name:word
        });
    }else{
        delete this.autoFillValues;
    }
  }

  getAutoFill(checksObject:Object){
    let autoFillTemp = this.autoFill;
    let res;
    for(let [key,value] of Object.entries(checksObject)){
      let found = autoFillTemp.filter(e => {
        try{
          return e[key].toLowerCase().includes(value.toLowerCase());
        }catch(err){
          return e[key] == value;
        }     
      });
      autoFillTemp = found;
    }
    return autoFillTemp;
  }
 
  getWord(autoFill?) {
    var sel:Selection, 
    word = "";
    sel = document.getSelection()
    // @ts-ignore
    if (sel.modify){
      let wordRange:Range;
      let selectedRange:Range;
      
      selectedRange = sel.getRangeAt(0);
      sel.collapseToStart();
      // @ts-ignore
      sel.modify("move", "backward", "word");
      // @ts-ignore
      sel.modify("extend", "forward", "word");
      wordRange = sel.getRangeAt(0);

      if(autoFill){
        wordRange.deleteContents();
        let newNode = document.createElement('div');
        newNode.className="inlineMarker";
        newNode.innerText = autoFill.name;
        newNode.dataset.id = autoFill.id;
        newNode.dataset.table = autoFill.table;
        newNode.contentEditable = "false";
        selectedRange.insertNode(newNode);
        selectedRange.setStartAfter(newNode);
        selectedRange.setEndAfter(newNode);
        this.autoFillValues = false;
        this.keyPress();
      }else{
        word = sel.toString();
      }
      // Restore selection
      sel.removeAllRanges();
      sel.addRange(selectedRange);
    }
    return word;
  }

  @Emit("autoFillChosen")
  autoFillChosen(autoFill){
    this.getWord(autoFill);
    return autoFill;
  }

  replacePlaceholders(value?, dbState?){
    if(typeof this.value !== "string" && !value) return;
    let v = value
    let regex = /{{(.*?)}}/im
    let match;
    let moreInstances = true;
    let tempValue = value || this.value;
    let failSafe = 0;
    let autoFill = dbState || this.autoFill;
    
    while(moreInstances && failSafe<100){
      if(tempValue != undefined){
        match = tempValue.match(regex);
        if(match){
          let strLen = match[0].length;
          let split = match[1].split("_");
          
          let tableName = split[0]
          let id = split[1]
          let start = match.index;
          
          let entity = autoFill.filter(e => e.table.toLowerCase().includes(tableName.toLowerCase()) && e.id==id)[0];
          
          if(!entity){
            entity = {
              name: "DELETED",
              id:0,
            } 
          }
          
          let newNode = document.createElement('div');
          newNode.className="inlineMarker";
          newNode.innerText = entity.name;
          newNode.dataset.id = entity.id;
          newNode.dataset.table = tableName;
          newNode.contentEditable = "false";
          tempValue = tempValue.replace(regex,newNode.outerHTML);
        }else{
          moreInstances = false;
        }
      }
    }

    if(value) return tempValue;
    this.valueDefault = tempValue;
    this.placeholdersSet = true;
  }

  display(event){
    let elem = event.srcElement as HTMLElement;
    console.log("DISPLAY");
    
    this.setPopupData(this.getAutoFill(elem.dataset)[0]);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.body{
  margin-bottom: 15px;
}


.textField{
  border: 1px solid $grey;
  outline: none;
  padding: 7px 10px;
  line-height: 1.5em;
  white-space: pre-wrap;
  border-radius: $radius;
  &:focus{
  border: 1px solid $prim;
    box-shadow: inset 0px 0px 0px 1px $prim;
  }
  img{
    max-width: 100%;
  }
}

</style>

<style lang="scss">
.inlineMarker{
  display: inline-block;
  background: $prim;
  padding: 0px 5px;
  color: white;
  cursor: pointer;
}
</style>
