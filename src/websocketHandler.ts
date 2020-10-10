import {REQ} from "./main"

export default class WebsocketHandler{
    socket:WebSocket;
    connecting:boolean = true;
    constructor(socket:WebSocket){
        this.socket = socket;
        this.connectingCheck();
        this.events();
    }

    connectingCheck(){
        
    }
    events(){
        this.socket.onopen = (event)=>{  
            this.connecting = false;
            REQ.triggerQueue();
        }

        this.socket.onmessage = (event) => {
            if(event.data && !event.data.startsWith("ERROR")){
                let res = JSON.parse(event.data);  

                if(res.id){
                    // NO ERROR
                    let req = REQ.activeRequests[res.id];
                    req.resolve(res.data);
                    req.cb(res.data);
                }else{
                    // ERROR
                    console.error(null,event.data);
                }
            }else{
                // STARTS WITH ERROR
                console.error(null,event.data);
            }
        }
    }
    sendJSONString(payload:string){
        this.socket.send(payload);
    }
}