<template>
  <div :class="{button:true, circle:circle, row:row}">
    <Ripple/>
    <Loader :circle="circle" :condition="this.condition || clicked">
      <div class="buttonContent">
        <div v-if="icon" class="icon material-icons">{{icon}}</div>
        {{ text }}
      </div>
    </Loader>
    <slot @click.stop/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import Ripple from '@/components/ripple.vue';
import Loader from '@/components/spinLoader.vue';

@Options({
  components: { 
    Loader,
    Ripple
  },
})
export default class Button extends Vue {
  @Prop() text:string;
  @Prop() icon:string;
  @Prop() circle:boolean;
  @Prop() row:boolean;
  @Prop() condition:Promise<any> | boolean;
  clicked:boolean = false;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  .button{
    width: auto;
    height: 30px;
    cursor:pointer;
    display: inline-block;
    position: relative;
    border-radius: $radius;
    background: #fff;
    transition: all 0.5s $cubic;
    box-shadow: 0px 0px 0px 1px $grey; 
    &:hover{
      box-shadow: 0px 0px 10px 1px $grey; 
    }
    .buttonContent{
      padding: 5px;
      height: 20px;
      line-height: 1em;
      white-space: nowrap;
      vertical-align: top;
      .icon{
        display: inline-block;
        vertical-align: top;
      }
    }

    &.circle{
      width: 30px;
      border-radius: 50%;
      box-shadow: 0px 0px 0px 1px transparent; 
      background: transparent;
      .buttonContent{
        padding: 0px;
        .icon{
          width: 24px;
          margin:auto;
        line-height: 26px;
          text-align: center;
        }
      }
      
    }

    &.row{
      display: block;
      box-shadow: 0px 0px 0px 1px transparent; 
      border-radius: 0px;
      height: auto;
      padding: 5px 10px;
      &:hover{
        background: $lightGrey;
      }
      *{
        line-height: 20px;
      }
    }
  }

</style>
