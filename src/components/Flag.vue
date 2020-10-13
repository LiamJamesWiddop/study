<template>
  <div :class="{flag:true,noPadding:noPadding}">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Component, Prop, Watch, Emit} from 'vue-property-decorator'
import Input from "@/components/Input.vue";

@Options({
  props: {
    msg: String
  },
  components: { 
    Flag,
    Input,
  },
  emits:[]
})
export default class Flag extends Vue {

  @Prop({}) noPadding:boolean;
 
 mounted(){
    this.docEvents();
  }
  beforeUnmount(){
    this.unDocEvents();
  }

  docEvents(){
    document.addEventListener('click', this.close)
  }
  unDocEvents(){
    document.removeEventListener('click', this.close)
  }

  @Emit("close")
  close(){
    console.log("CLOSED");
    return false;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .flag{
    min-width: 100px;
    position: absolute;
    right: 0px;
    top: 0px;
    width: auto;
    padding: 15px;
    border-radius: $radius;
    box-shadow: $lightShadow;
    background: #fff;
    z-index: 999;
    line-height: 1em;
    color: #000;
    h4{
      padding-bottom: 10px;
    }

    &.noPadding{
      padding: 5px 0px;
    }
  }
</style>
