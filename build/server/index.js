"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const ws = require("ws");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');
const webhook_1 = require("./webhook");
const dbManager_1 = require("./dbManager");
const ENTITIES = path.resolve(__dirname, './entities/*{.js,.ts}');
const CONNECTION = dbManager_1.default.connect("medprep", [ENTITIES]);
const requestHandler_1 = require("./requestHandler");
const REQ = new requestHandler_1.default(CONNECTION);
const app2 = express();
app2.use(cors());
app2.use(bodyParser.json());
app2.get("/webhook", async (req, res) => {
    let result = await webhook_1.default.getBest();
    res.send(result);
});
app2.get("/trial", (req, res) => {
    res.send("it actually works tho...");
});
app2.post('/webhook', async (req, res) => {
    let result = await webhook_1.default.getBest();
    res.send(result);
});
app2.use("/", express.static(path.resolve(__dirname, "../../dist/")));
app2.use(history({
    disableDotRule: true,
    verbose: true
}));
app2.use("/", express.static(path.resolve(__dirname, "../../dist/")));
function getApp() {
    return app2;
}
function websocketHandler(wsServer) {
    wsServer.on('connection', socket => {
        socket.on('message', async (payload) => {
            payload = JSON.parse(payload);
            let error;
            let res = payload;
            if (payload.method) {
                try {
                    res.data = await REQ[payload.method](payload.store, payload.action, payload.data);
                    socket.send(JSON.stringify(res));
                }
                catch (err) {
                    console.log(err);
                    socket.send(`ERROR: ${err}`);
                }
            }
        });
    });
    return wsServer;
}
;
module.exports.ws = websocketHandler;
module.exports.app = getApp;
//# sourceMappingURL=index.js.map