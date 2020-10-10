<template>
  <div class="searchBar">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { navRoutes, currentRoute } from "@/router"

@Options({
  props: {
  },
  components: { 
    SearchBar,
  },
})
export default class SearchBar extends Vue {

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    .searchBar{
        height: 56px;
        line-height: 56px;
        display: grid;
        grid-template-columns: 1fr auto auto auto auto;
        border-bottom: 1px solid $grey;
        top:0;
        position: sticky;
        align-items: center;
        .inputWrapper{
          display: grid;
          grid-template-columns: 40px auto;
          line-height: 56px;
          text-align: center;
        }
    }
</style>
