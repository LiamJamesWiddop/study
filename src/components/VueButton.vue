<template>
  <div class="button">
    <Ripple/>
    <Loader :condition="this.condition || clicked">
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
      height: 1em;
      line-height: 1em;
      white-space: nowrap;
      vertical-align: top;
      .icon{
        display: inline-block;
        vertical-align: top;
        padding-right: 5px;
      }
    }
  }

</style>
