import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'
import RequestHandler from "./requestHandler"

declare module '@vue/runtime-core' {
    // Declare your own store states.
    interface State {
      count: number
    }
  
    interface ComponentCustomProperties {
      $store: Store<State>
    }

    interface ComponentCustomProperties {
      $request: RequestHandler
    }
}