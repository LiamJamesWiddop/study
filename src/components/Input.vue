<template>
  <div :class="{input:true, focus:isFocussed, labelUp:isFocussed||value}">
    <label @click="focusElement">{{label}}</label>
    <input v-if="!multi" @focus="isFocussed=true" ref="input" type="text" v-model="value" @blur="isFocussed=false">
    <textarea v-else @focus="isFocussed=true" ref="input" type="text" v-model="value" @blur="isFocussed=false"/>
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
    Input,
  },
  emits:[]
})
export default class Input extends Vue {
  @Prop({}) label:string
  @Prop({}) multi:boolean

  isFocussed:boolean=false;
  value:string;

  focusElement(){
    (this.$refs.input as HTMLInputElement).focus()
  }

  @Emit('input')
  input(){
    return this.value;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .input{
    display: grid;
    column-gap: 15px;
    margin-bottom: 10px;
    position: relative;
    cursor: text;
    
    label{
      height: 1em;
      line-height: 1em;
      position: absolute;
      left: 5px;
      top: 50%;
      background: white;
      padding: 0px 5px;
      font-size: $fontMedium;
      color: $darkGrey;
      transition: all 0.25s $cubic;
      cursor: text;
      transform: translate3d(0px, -50%, 0px);
    }
    input, textarea{
      padding: 10px 10px;
      line-height: 20px;
      font-size: $fontMedium;
      border: 1px solid $grey;
      border-radius: $radius;
      outline: none;
    }

    &.focus{
      input{
        border-radius: $radius;
        border: 1px solid $prim;
        box-shadow: 0px 0px 0px 1px  $prim;
      }
    }

    &.labelUp{
      label{
        top:0px;
        color: $prim;
        font-size: $fontSmall;
      }
    }
  }
</style>
