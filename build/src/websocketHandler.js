"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
class WebsocketHandler {
    constructor(socket) {
        this.connecting = true;
        this.socket = socket;
        this.connectingCheck();
        this.events();
    }
    connectingCheck() {
    }
    events() {
        this.socket.onopen = (event) => {
            this.connecting = false;
            main_1.REQ.triggerQueue();
        };
        this.socket.onmessage = (event) => {
            if (event.data && !event.data.startsWith("ERROR")) {
                let res = JSON.parse(event.data);
                if (res.id) {
                    let req = main_1.REQ.activeRequests[res.id];
                    req.resolve(res.data);
                    req.cb(res.data);
                }
                else {
                    console.error(null, event.data);
                }
            }
            else {
                console.error(null, event.data);
            }
        };
    }
    sendJSONString(payload) {
        this.socket.send(payload);
    }
}
exports.default = WebsocketHandler;
//# sourceMappingURL=websocketHandler.js.map