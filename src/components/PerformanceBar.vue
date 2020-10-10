<template>
  <div class="performanceBar">
    <template v-if="correct || incorrect">
      <div class="correct" :style="{width: `${perc}%`}">
        <div class="marker">
          Correct:{{correct}}
        </div>
      </div>
      <div class="incorrect" :style="{width: `${100-perc}%`}">
        <div class="marker">
          Incorrect:{{incorrect}}
        </div>
      </div>
    </template>
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
    PerformanceBar,
  },
  emits:[]
})
export default class PerformanceBar extends Vue {
  @Prop({}) correct:number;
  @Prop({}) incorrect:number;
  @Prop({}) ratio:number;

  perc;
  mounted(){
    this.updatePerc();
  }

  @Watch('ratio')
  @Watch('correct')
  @Watch('incorrect')
  updatePerc(){
    this.perc = (this.correct/(this.incorrect+this.correct))*100;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.performanceBar{
  position: relative;
  height: 4px;
  width: 300px;
  background: $grey;
  border-radius: 5px;
  cursor: default;
  font-size: $fontSmall;
  >div{
    display: inline-block;
    vertical-align: top;
    position: relative;
    .marker{
      display: none;
      position: absolute;
      left:50%;
      bottom: 100%;
      background: #fff;
      box-shadow: $lightShadow;
      transform: translate3d(-50%,0px,0px);
      padding: 3px 5px;
      border-radius: $radius;
    }

    &:hover .marker{
      display: inline-block;
    }
  }
}
  .correct{
    height: 100%;
    background: $green;
  }
  .incorrect{
    height: 100%;
    background: $red;
  }
</style>
