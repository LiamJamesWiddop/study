<template>
  <div class="NavBar">
      <div class="name">Hermes</div>
      <div :class="{_field:true, current:currentRoute.name == route.name}" 
      v-for="route in routes" 
      :key="route.path" 
      @click="redirect(route.navPath || route.path)">
        {{route.name}}
      </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { navRoutes, currentRoute } from "@/router"

@Options({
  props: {
  },
  components: { 
    NavBar,
  },
})
export default class NavBar extends Vue {
    routes=navRoutes();
    currentRoute=currentRoute;

    redirect(route:string){
        this.$router.push(route);
    } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    .NavBar{
        height: 56px;
        line-height: 56px;
        display: grid;
        grid-template-columns: 1fr auto auto auto auto;
        padding: 0px 50px;
        border-bottom: 1px solid $grey;
        .name{
          margin: 0px;
          font-size: $fontGiant;
          font-weight: $fontMiddle;
        }
        ._field{
            width: auto;
            padding: 0px 20px;
            cursor: pointer;
            text-transform: capitalize;
            font-weight: $fontHeavy;
            box-sizing: border-box;
            &:hover{
                opacity: 1;
            }
            &.current{
              box-shadow: inset 0px -2px 0px 0px $prim;
              color: $prim;
            }
        }
    }
</style>
