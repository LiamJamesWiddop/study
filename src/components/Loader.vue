<template>
  <div class="loader">
    <div class="spinner" v-if="loading" :style="loaderStyle"></div>
    <div :class="{loaderBody:true, hidden:loading}">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';

@Options({
  components: { 
    Loader,
  },
})
export default class Loader extends Vue {
  isLoading:boolean = false;
  parentEl:HTMLElement;
  bounds:{width:number,height:number} = {width:0,height:0}
  coords:{x:number,y:number} = {x:0,y:0}
  loaderStyle:{
    width:string,
    height:string,
    left:string,
    top:string,
  } = {
    width:"0px",
    height:"0px",
    left:"0%",
    top:"0%",
  }
  
  @Prop() condition:Promise<any> | boolean;
  mounted(){
    this.parentEl = this.$parent.$el;
    this.isPromise();
  }

  get loading(){
    return this.isLoading;
  }


  @Watch('condition') 
  async isPromise(){
    if(typeof this.condition == "boolean"){
      this.isLoading = this.condition;
    }else{
      this.isLoading = true;
      await this.condition;
      this.isLoading = false;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.loader{
  position: relative;
  
  .spinner{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    border: 2px solid black;
  }
  .hidden{
    background: $grey;
    color: $darkGrey;
  }
}

</style>
