<template>
  <router-view/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
  components: { 
  },
  mixins: []
})
export default class App extends Vue { 
  mounted(){
  }
}
</script>

<style>

#page{
  max-width: 1200px;
  padding: 0px 50px;
  margin: auto;
}

#footer{
  padding-bottom: 40px;
}

@media only screen and (max-width: 700px) {
  #page{
    padding: 0px 25px;
  }
}
</style>
