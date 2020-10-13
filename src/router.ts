import { createWebHistory, createRouter } from "vue-router";
import Root from '@/views/Root.vue'
import Quiz from '@/views/Quiz.vue'
import Editor from '@/views/Editor.vue'
import Data from '@/views/Data.vue'
import Decks from '@/views/Decks.vue'
import Osce from '@/views/Osce.vue'

export const routes = [
    {
        path:"/",
        name:"home",
        component:Root,
        hide:true,
    },
    {
        path:"/quiz/:view?/:id?",
        name:"quiz",
        component:Quiz,
        navPath:'/quiz',
    },
    {
        path:"/osce",
        name:"osce",
        component:Osce,
        hide:true,
    },
    {
        path:"/data",
        name:"data",
        component:Data,
    },
    {
        path:"/decks",
        name:"Decks",
        component:Decks,
        children:[
            {
                path:"/editor/:id",
                name:"editor",
                component:Editor,
            }
        ]
    },
    // EDITOR FORMS
    // {
    //     path:"/editor/:form/:id",
    //     name:"editor",
    //     component:Editor,
    //     hide:true,
    // },
    
]
const Router = createRouter({
    history: createWebHistory(),
    routes,
});

export const navRoutes = () => {
    let navRoutes = [];
    for(let route of routes){
        if(!route.hide){
            navRoutes.push(route)
        }
    }
    return navRoutes;
}

export let currentRoute = Router.currentRoute;
export default Router;