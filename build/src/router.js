"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentRoute = exports.navRoutes = exports.routes = void 0;
const vue_router_1 = require("vue-router");
const Root_vue_1 = require("@/views/Root.vue");
const Quiz_vue_1 = require("@/views/Quiz.vue");
const Editor_vue_1 = require("@/views/Editor.vue");
const Data_vue_1 = require("@/views/Data.vue");
const Osce_vue_1 = require("@/views/Osce.vue");
exports.routes = [
    {
        path: "/",
        name: "home",
        component: Root_vue_1.default,
        hide: true,
    },
    {
        path: "/quiz/:view?/:id?",
        name: "quiz",
        component: Quiz_vue_1.default,
        navPath: '/quiz',
    },
    {
        path: "/osce",
        name: "osce",
        component: Osce_vue_1.default
    },
    {
        path: "/data",
        name: "data",
        component: Data_vue_1.default,
    },
    {
        path: "/editor/:form/:id",
        name: "editor",
        component: Editor_vue_1.default,
        hide: true,
    },
];
const Router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(),
    routes: exports.routes,
});
exports.navRoutes = () => {
    let navRoutes = [];
    for (let route of exports.routes) {
        if (!route.hide) {
            navRoutes.push(route);
        }
    }
    return navRoutes;
};
exports.currentRoute = Router.currentRoute;
exports.default = Router;
//# sourceMappingURL=router.js.map