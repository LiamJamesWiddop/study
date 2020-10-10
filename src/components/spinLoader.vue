<template>
  <div class="spinLoaderWrapper">
    <div class="contentWrapper">
      <slot/>
    </div>
    <div :class="{
    spinLoad:true,
    coloured:coloured,
    success:success,
    fail:fail,
      }">
      <template v-if="isLoading || success || fail">
        <div class="border"></div>
        <div v-if="!success && !fail" class="block"></div>
        <div class="checkWrapper">
          <div v-if="success" class="checkmark"></div>
          <div v-if="fail" class="cross"></div>
        </div>
      </template>
    </div>
    
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
import Alert from '@/components/alert.vue'; 

@Options({
  components:{
    
  }
})
export default class SpinLoader extends Vue {
  isLoading:boolean = false;
  fail:boolean = false;
  success:boolean = false;

  @Prop({}) coloured:boolean;
  @Prop({}) condition:Promise<any> | boolean;

  reset(){
    setTimeout(()=>{
      this.success = false;
      this.fail = false;
    },1500)
  }

  @Watch('condition') 
  async isPromise(){
    // new Alert({
    //   text: "yes",
    //   timeout: 1000
    // })
    if(typeof this.condition == "boolean"){
      this.isLoading = this.condition;
    }else{
      this.isLoading = true;
      await this.condition.then(()=>{
        this.success = true;
      }).catch(err=>{
        this.fail = true;
      });
      this.isLoading = false;
      this.reset();
    }
  }
}  

</script>

<style lang="scss" scoped>

  .contentWrapper{
    z-index: 9;
    position: relative;
    padding: 3px;
  }
  .spinLoad{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index: 0;
    overflow: hidden;
    border-radius: $radius;

    .border{
      position: absolute;
      left:3px;
      right:3px;
      top:3px;
      bottom:3px;
      background: #FFFFFF;
      border-radius:$radius;
    }

    &.coloured{
      background: $prim;
      .border{
        background: $prim;
      }
    }
    &.success{
      background: $prim;
      z-index: 9999;
      .border{
        background: $prim;
      }
    }
    &.fail{
      background: $red;
      z-index: 9999;
      .border{
        background: $red;
      }
    }

    .block{
      position: absolute;
      left:0;
      top:0;
      width: 100%;
      height: 100%;
      box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.35);
      border-radius: 50%;
      transform-origin: 0% 50%;
      background: rgba(0,0,0,0.35);
      z-index: -1;
      animation: spinner 2s linear infinite;
    }
  }


  $ckH: 1em;
  $ckW: 0.6em;
  .checkWrapper{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    height: $ckW;
    width: $ckH;
    margin: auto;
  }

  .checkmark {
    animation-duration: 300ms;
    animation-timing-function: $cubic;
    animation-name: checkmark;
    transform: scaleX(-1) rotate(135deg);
    opacity: 1;
    height: $ckH;
    width: $ckW;
    box-shadow: 2px -2px 0px 0px #FFFFFF;
    position: absolute;
    transform-origin: top left;
    top:0;
  }
  .cross {
    animation-duration: 100ms;
    animation-timing-function: $cubic;
    animation-name: cross;
    transform: rotate(-45deg);
    opacity: 1;
    height: $ckH;
    width: 2px;
    background: #FFFFFF;
    position: absolute;
    transform-origin: top left;
    top:0;
    &::after{
      content:'';
      animation-duration: 100ms;
      animation-timing-function: $cubic;
      animation-name: cross;
      transform: rotate(90deg);
      opacity: 1;
      height: $ckH;
      width: 2px;
      background: #FFFFFF;
      position: absolute;
      transform-origin: top center;
      top: $ckH/2;
      left: $ckH/2
    }
  }

  
  @keyframes spinner{
    0%{
      transform: translate3d(75%,0px,0px) rotate(0deg);  
    }
    25%{
      transform: translate3d(50%,0px,0px)  rotate(90deg);  
    }
    50%{
      transform: translate3d(25%,0px,0px)  rotate(180deg);  
    }
    75%{
      transform: translate3d(50%,0px,0px)  rotate(270deg);  
    }
    100%{
      transform: translate3d(75%,0px,0px)  rotate(360deg);  
    }
  }
  
  @keyframes checkmark {
    0% {
      height: 0;
      width: 0;
      opacity: 1;
    }
    50% {
      height: 0;
      width: $ckW;
      opacity: 1;
    }
    100% {
      height: $ckH;
      width: $ckW;
      opacity: 1;
    }
  }
  @keyframes cross {
    0% {
      height: 0;
      opacity: 1;
    }
    100% {
      height: $ckH;
      opacity: 1;
    }
  }

</style>
