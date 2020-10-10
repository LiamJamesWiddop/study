<template>
  <div class="button">
    
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
    HelloWorld,
  },
  emits:[]
})
export default class HelloWorld extends Vue {
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
