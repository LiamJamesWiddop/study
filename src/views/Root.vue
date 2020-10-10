<template>
  <NavBar></NavBar>
  <div id="page">
    ROOT
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import VueButton from '../components/VueButton.vue';
import NavBar from '../components/NavBar.vue';

@Options({
  components: { 
    VueButton,
    NavBar
  },
})
export default class App extends Vue { 
  
}
</script>

<style>
@import url("../assets/style.scss");

</style>
