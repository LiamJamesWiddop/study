const express = require('express');
const app = express();
const ws = require("ws");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const history = require('connect-history-api-fallback');

import CONFIG from "../config";
app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());

// db controls
import DBMANAGER from "./dbManager";
const ENTITIES = path.resolve(__dirname,'./entities/*{.js,.ts}')
const CONNECTION = DBMANAGER.connect("medprep",[ENTITIES]);

import API from "./api"
// begin static express site for production site
if(CONFIG.PRODUCTION == true){
  let vue = express.static("./dist/");
  app.use(vue);
  app.use(history({
      disableDotRule: true,
      verbose: true
  }));
  app.use(vue);

  app.use("/webhook", (req,res)=>{
    console.log(req);
    API.getBest(null,undefined).then((questions)=>{
      res.send(questions[0])
    });
  });
}else{
  // START SERVER
}

// REQUEST HANDLER
import RequestHandler from "./requestHandler";
const REQ = new RequestHandler(CONNECTION);

if(CONFIG.PRODUCTION == true){
  const server = app.listen(CONFIG.port, (err)=>{
    console.log("App listening on port",CONFIG.port);
  });
  let wsServer = new ws.Server({ server: server });
  websocketHandler(wsServer);
}

function getApp(){
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
};

module.exports.ws = websocketHandler;
module.exports.app = getApp;