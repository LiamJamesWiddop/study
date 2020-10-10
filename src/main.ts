import { createApp } from 'vue';
import { createStore } from "vuex";
import App from "./App.vue";
import Router from "./router";
import WebsocketHandler from "./websocketHandler";
import WebsocketPlugin from "./subscriber";
import database from "../store/databaseStore";
import requestHandler from "./requestHandler"

const wsprotocol = location.protocol=='http:'?'ws:':'wss:';
const serverport = location.protocol=='http:'?80:443;
const ws = new WebSocket(`${wsprotocol}//${window.location.hostname}:${serverport}`);
const websocketHandler = new WebsocketHandler(ws);
const wsPlugin = WebsocketPlugin(websocketHandler);

export const store = createStore({
    state:{},
    modules:{
        database
    },
    plugins:[wsPlugin]
})

export const REQ = new requestHandler;
REQ.ws = websocketHandler;
REQ.Store = store;

export const app = createApp(App);
app.use(Router)
app.use(store)
app.mount('#app');
app.config.globalProperties.$request = REQ;