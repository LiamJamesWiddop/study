"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestHandler {
    constructor() {
        this.activeRequests = [];
        this.requestQueue = [];
        this.reqCount = 1;
    }
    async POST(req, data, cb) {
        let id = this.reqCount++;
        let split = req.split("/");
        let store = split[0];
        let action = split[1];
        let payload = {
            id,
            method: "POST",
            store: store,
            action: action,
            data,
            cb,
            isModule: false,
        };
        payload.promise = new Promise((resolve, reject) => {
            payload.resolve = resolve;
        });
        if (this.ws.connecting) {
            this.requestQueue.push(payload);
        }
        else {
            this.SEND(payload);
        }
        return payload.promise;
    }
    SEND(payload) {
        this.activeRequests[payload.id] = payload;
        payload.isModule = this.vuexModuleExists(payload.store);
        let payloadJSONstring = JSON.stringify(payload);
        if (payload.isModule) {
            if (this.Store._mutations[`${payload.store}/${payload.action}`]) {
                this.Store.commit(`${payload.store}/${payload.action}`, { payload: payloadJSONstring, promise: payload.promise, callback: payload.cb });
            }
            else {
                this.Store.dispatch(`${payload.store}/${payload.action}`, { payload: payloadJSONstring, promise: payload.promise, callback: payload.cb });
            }
        }
        else {
            this.ws.sendJSONString(payloadJSONstring);
        }
    }
    vuexModuleExists(name) {
        return this.Store.hasModule(name);
    }
    triggerQueue() {
        for (let request of this.requestQueue) {
            this.SEND(request);
        }
    }
}
exports.default = RequestHandler;
//# sourceMappingURL=requestHandler.js.map