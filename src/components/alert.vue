<template>
  <div :class="{
    alert:true,
    small:small,
  }"
  @click.stop>
  <div class="text">{{ text }}</div>
  <div @click.stop="remove" class="close material-icons">close</div>
  </div>
</template>

<script lang="ts">

import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch} from 'vue-property-decorator'
import {app} from "../main"

export interface alertInterface{
  text:string,
  timeout?:number,
  options?:{
      text:string,
      function: Function
  }[]
}

export default class Alert extends Vue {

  text:string = "";
  small:boolean = true;
  alTimeout:any;

  constructor(val:alertInterface, callback?:Function){

    super(arguments)

    this.text = val.text;
    if(val.options && val.options.length > 0){
      this.small = false;
    }

    if(!document.getElementById('alertContainer')){
      let el = document.createElement('div');
      el.id = "alertContainer";
      document.getElementById("app").appendChild(el);
    }

    app.component("alert",this);
    let container = document.getElementById('alertContainer');
    
    if(container){
      container.appendChild(this.$el);
      if(callback){
        this.alTimeout = setTimeout(() => {
          callback();
        }, val.timeout)
      }else if(val.timeout){
        this.alTimeout = setTimeout(() => {
          this.remove();
        }, val.timeout)
      }
    }else{
      alert("you need an ID:alertContainer in the document body to ellicit alerts");
      return;
    }
  }

  remove(){
    if(this.$el.parentNode){
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>

<style lang="scss" scoped>

  @keyframes enter{
    0%{
      transform: translate3d(0px, 200%, 0px);
      opacity: 0;
    }
    100%{
      transform: translate3d(0px, 0%, 0px);
      opacity: 1;
    }
  }

  .alert{
    box-shadow: $lightShadow;
    max-width: 100%;
    background: $prim;
    color: #FFFFFF;
    padding: 10px 10px 10px 15px;
    line-height: 17px;
    border-radius: $radius;
    z-index: 99;
    animation-duration: 2s;
    -webkit-backface-visibility: hidden;
    transform: translate3d(0,0,0);
    transition: opacity 0.25s $cubic;
    animation: enter 0.35s cubic-bezier(.32,1.16,.72,.96);
    font-weight: 500;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 10px;
    margin-top: 10px;

    .close{
      cursor: pointer;
      font-size: 18px;
      vertical-align: top;
    }
  }
</style>