"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Subscriber(websocketHandler) {
    return (StoreInstance) => {
        if (StoreInstance) {
            StoreInstance.subscribeAction((action) => {
                let payload = JSON.parse(action.payload.payload);
                if (payload.method) {
                    let string = JSON.stringify(payload);
                    websocketHandler.sendJSONString(string);
                }
            });
            StoreInstance.subscribe((mutator) => {
                let payload = JSON.parse(mutator.payload.payload);
                if (payload.method) {
                    let string = JSON.stringify(payload);
                    websocketHandler.sendJSONString(string);
                }
            });
        }
    };
}
exports.default = Subscriber;
//# sourceMappingURL=subscriber.js.map