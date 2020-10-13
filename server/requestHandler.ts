import { Connection, Entity, EntityMetadata, EntitySchema } from "typeorm";
import API from "./api";
export default class RequestHandler{
    CONNECTION:Connection|void;
    ENTITIES:any[] = [];

    constructor(connection:Promise<void | Connection>){
        this.init(connection);
    }

    async init(connection:Promise<void | Connection>){
        await this.getConnection(connection);
        await this.getEntities();
    }

    async getConnection(connection:Promise<void | Connection>){
        this.CONNECTION = await connection;
    }

    getEntities(){
        if(this.CONNECTION){
            let EntityMetadatas:EntityMetadata[] = this.CONNECTION.entityMetadatas;
            for(let EntityMetadata of EntityMetadatas){
                let name = (EntityMetadata.name).toLowerCase();
                console.log("ENTITY", name);
                this.ENTITIES[name] = {
                    target:EntityMetadata.target,
                    relations:this.getRelations(EntityMetadata),
                }
            }
            API.ENTITIES = this.ENTITIES;
        }else{
            console.error("NO CONNECTION");
        }
    }

    getRelations(EntityMetadata:EntityMetadata){
        let relations:{
            name:string,
            type:String|Function,
            target:String|Function,
        }[] = [];
        for(let relation of EntityMetadata.relations){
            relations.push({
                name:relation.propertyName,
                type:relation.type,
                target:relation.target
            });
            console.log("->",relation.propertyName,relation.type,"is observing",relation.target);
        }
        return relations;
    }

    async POST(store,action,data){
        try{
            if(action == "new"){
                let entityFunction = this.ENTITIES[store].target;
                let entity = await entityFunction.create();
                for(let [key,value] of Object.entries(data)){
                    entity[key] = value;
                }
                await entity.save();
                return entity;
            }else{
                let res;
                let tables = [];
                let req;
                let flags = undefined;
                let d = undefined;

                for(let [key,value] of Object.entries(data)){
                    if(key == 'tables'){
                        let tableArr = value as Array<any>;
                        for(let table of tableArr){
                            tables.push(table);
                        }
                    }
                    if(key == 'data'){
                        d = value;
                    }
                    if(key == 'flags'){
                        flags = await this.ENTITIES[`flag`].target['find']({
                            select:['time','table','entry_id']
                        });
                    }
                }

                if(store == "database"){
                    if(tables.length == 0 && data.length > 0){
                        tables = data;
                    }
                    res = {};
                    for(let table of tables){
                        try{
                            let entries = await this.ENTITIES[table].target[req||'find'](d);
                            if(flags){
                                for(let i=0;i<entries.length;i++){
                                    let entry = entries[i];
                                    let flagsFiltered = flags.filter(function(item) { 
                                        return (item.entry_id == entry.id && item.table == table); 
                                    });
                                    entries[i] = {...entry,flags:flagsFiltered}
                                }
                            }
                            res[table] = entries;
                        }catch(err){
                            throw err;
                        }
                    }
                }else{
                    if(this.ENTITIES[store].relations && data.relations){
                        for(let i=0; i<this.ENTITIES[store].relations.length; i++){
                            let relationName = this.ENTITIES[store].relations[i].name
                            let relationData = data.relations[relationName];
                            if(relationData){
                                console.log(this.ENTITIES[store].relations[i].name, "CALLED");
                                let relationFunction = this.ENTITIES[store].relations[i].type;
                                let relationInstance = await relationFunction.create();
                                for(let [key,value] of Object.entries(relationData)){
                                    relationInstance[key] = value;
                                }
                                let newRelation  = await relationInstance.save();
                                console.log("NEW",relationName,":",newRelation);
                                
                                if(d[relationName]){
                                    d[relationName].push(newRelation)
                                }else{
                                    d[relationName] = [newRelation]
                                }
                                break;
                            }
                        }
                    }
                    if(this.ENTITIES[store] && this.ENTITIES[store].target[action]){
                        console.log("SENDING",(d||data));
                        res = await this.ENTITIES[store].target[action](d || data);
                    }else if(API[action]){
                        console.log("CANNOT FIND ENTITY FOR",store,action);
                        res = await API[action](store,data)
                    }
                    console.log(res);
                }
                return res
            }
        }catch (err){
            throw err;
        }
    }

    async webhookTest(req){
        console.log(req);
        let val = await this.ENTITIES['disease'].target['find']();
        return val;
    }
}