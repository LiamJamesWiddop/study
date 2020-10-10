import { Store } from "vuex";
import WebsocketHandler from "./websocketHandler";
interface request{
    id:number,
    method:"POST",
    store:string,
    action:string,
    data:Object,
    cb:Function,
    isModule:boolean,
    promise?:Promise<any>,
    resolve?:Function
}
export default class RequestHandler{
    Store:Store<any>;
    ws:WebsocketHandler;
    activeRequests:request[] = [];
    requestQueue:request[] = [];
    reqCount:number = 1;

    async POST(req,data,cb){
        
        let id = this.reqCount++;
        let split = req.split("/");
        let store = split[0];
        let action = split[1];
        let payload:request = {
            id,
            method:"POST",
            store:store,
            action:action,
            data,
            cb,
            isModule:false,
        }

        payload.promise = new Promise<any>((resolve,reject) => {
            payload.resolve = resolve;
        });
        
        if(this.ws.connecting){
            this.requestQueue.push(payload);
        }else{
            this.SEND(payload)
        }

        return payload.promise;
    }

    SEND(payload:request){
        this.activeRequests[payload.id] = payload;
        payload.isModule = this.vuexModuleExists(payload.store);
        
        let payloadJSONstring = JSON.stringify(payload);

        if(payload.isModule){
            // @ts-ignore
            if(this.Store._mutations[`${payload.store}/${payload.action}`]){
                this.Store.commit(`${payload.store}/${payload.action}`,{payload:payloadJSONstring, promise:payload.promise, callback:payload.cb});
            }else{
                this.Store.dispatch(`${payload.store}/${payload.action}`,{payload:payloadJSONstring, promise:payload.promise, callback:payload.cb});
            }
        }else{
            this.ws.sendJSONString(payloadJSONstring);
        }
    }

    vuexModuleExists(name){
        return this.Store.hasModule(name);
    }

    triggerQueue(){
        for(let request of this.requestQueue){
            this.SEND(request);
        }
    }
}
