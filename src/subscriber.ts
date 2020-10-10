import { Store } from "vuex";
export default function Subscriber(websocketHandler){   
    return (StoreInstance:Store<any>)=>{
        if(StoreInstance){
            StoreInstance.subscribeAction((action) => {
                let payload = JSON.parse(action.payload.payload);
                if(payload.method){
                    let string = JSON.stringify(payload);
                    websocketHandler.sendJSONString(string);
                }
            })
            StoreInstance.subscribe((mutator) => {
                let payload = JSON.parse(mutator.payload.payload);
                if(payload.method){
                    let string = JSON.stringify(payload);
                    websocketHandler.sendJSONString(string);
                }
            })
        }
    }
}