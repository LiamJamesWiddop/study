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
const config_1 = require("../config");
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
const dbManager_1 = require("./dbManager");
const ENTITIES = path.resolve(__dirname, './entities/*{.js,.ts}');
const CONNECTION = dbManager_1.default.connect("medprep", [ENTITIES]);
const api_1 = require("./api");
if (config_1.default.PRODUCTION == false) {
    let vue = express.static("./dist/");
    app.use(vue);
    app.use(history({
        disableDotRule: true,
        verbose: true
    }));
    app.use(vue);
    app.use("/webhook", (req, res) => {
        console.log(req);
        api_1.default.getBest(null, undefined).then((questions) => {
            res.send(questions[0]);
        });
    });
}
else {
}
const requestHandler_1 = require("./requestHandler");
const REQ = new requestHandler_1.default(CONNECTION);
if (config_1.default.PRODUCTION == false) {
    const server = app.listen(config_1.default.port, (err) => {
        console.log("App listening on port", config_1.default.port);
    });
    let wsServer = new ws.Server({ server: server });
    websocketHandler(wsServer);
}
function getApp() {
    return app;
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