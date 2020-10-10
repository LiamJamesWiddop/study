<template>
  <div class="autofill" :style="coords" v-if="coords && values">
    <div :class="{option:true, hover:autoFillIndex == index}" v-for="(value,index) in values" :key="value" @click="choose(value)">{{ value.name }}</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'

@Options({
  props: {
    msg: String
  },
  components: { 
    AutoFill,
  },
  emits:['choose']
})
export default class AutoFill extends Vue {
  @Prop({required:true}) values:Object[];
  @Prop({required:true}) autoFillIndex:number;
  
  coords:{
    left?:string,
    top?:string,
  } = {}

  mounted(){
    this.update();
  }

  @Emit()
  choose(value){
    return value;
  }

  @Watch('values')
  update(){
    this.coords = this.selectionCoords();
    console.log(this.coords);
  }

  selectionCoords(){
    let coords = this.coords || {left:'0px',top:"0px"};
    if(!this.coords.left){
      let range = document.getSelection().getRangeAt(0).cloneRange();
      if (range.getClientRects) {
          range.collapse(true);
          let rect;
          let rects = range.getClientRects();
          if (rects.length > 0) {
              rect = rects[0];
          }
          if(rect){
            coords.left = `${rect.left}px`;
            coords.top = `${rect.top + 30}px`;
          }else{
            coords = {};
          }
      }
    }
    return coords;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .autofill{
    position: fixed;
    background:#fff;
    border: 1px solid black;
    -webkit-user-select: none;  
    -moz-user-select: none;    
    -ms-user-select: none;      
    user-select: none;
    .option{
      padding: 10px;
      cursor: pointer;
      &.hover{
        background:$grey;
      }
    }
  }

</style>
