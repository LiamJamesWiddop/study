<template>
  <NavBar></NavBar>
  <div id="page">
    d
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import VueButton from '@/components/VueButton.vue';
import NavBar from '@/components/NavBar.vue';

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


</style>
