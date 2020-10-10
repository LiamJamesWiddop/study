"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.REQ = exports.store = void 0;
const vue_1 = require("vue");
const vuex_1 = require("vuex");
const App_vue_1 = require("./App.vue");
const router_1 = require("./router");
const websocketHandler_1 = require("./websocketHandler");
const subscriber_1 = require("./subscriber");
const databaseStore_1 = require("../store/databaseStore");
const requestHandler_1 = require("./requestHandler");
const wsprotocol = location.protocol == 'http:' ? 'ws:' : 'wss:';
const serverport = location.protocol == 'http:' ? 80 : 443;
let ws;
require("net").connect({ host: window.location.hostname, port: 80 }, function (socket) {
    ws = socket;
});
const websocketHandler = new websocketHandler_1.default(ws);
const wsPlugin = subscriber_1.default(websocketHandler);
exports.store = vuex_1.createStore({
    state: {},
    modules: {
        database: databaseStore_1.default
    },
    plugins: [wsPlugin]
});
exports.REQ = new requestHandler_1.default;
exports.REQ.ws = websocketHandler;
exports.REQ.Store = exports.store;
exports.app = vue_1.createApp(App_vue_1.default);
exports.app.use(router_1.default);
exports.app.use(exports.store);
exports.app.mount('#app');
exports.app.config.globalProperties.$request = exports.REQ;
//# sourceMappingURL=main.js.map