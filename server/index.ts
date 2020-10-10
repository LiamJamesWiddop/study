const express = require('express');
const app = express();
const ws = require("ws");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');

import CONFIG from "../config";
import webhook from "./webhook"

// db controls
import DBMANAGER from "./dbManager";
const ENTITIES = path.resolve(__dirname,'./entities/*{.js,.ts}')
const CONNECTION = DBMANAGER.connect("medprep",[ENTITIES]);

// REQUEST HANDLER
import RequestHandler from "./requestHandler";
const REQ = new RequestHandler(CONNECTION);

const app2 = express();
// app2.use(morgan('tiny'));
app2.use(cors());
app2.use(bodyParser.json());

// establish all non-vue related routes
app2.get("/webhook",async (req,res) => {
  let result = await webhook.getBest();
  res.send(result);
})

// establish vue and associated router
app2.use("/",express.static("../../dist/"))
app2.use(history({
    disableDotRule: true,
    verbose: true
}));
app2.use("/",express.static("../../dist/"))

// const server = app2.listen(CONFIG.port, (err)=>{
//   console.log("App listening on port",CONFIG.port);
// });
// let wsServer = new ws.Server({ server: server });
// websocketHandler(wsServer);

function getApp(){
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
};

module.exports.ws = websocketHandler;
module.exports.app = getApp;