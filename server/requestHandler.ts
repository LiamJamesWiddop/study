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
        let relations:(string|Function)[] = [];
        for(let relation of EntityMetadata.relations){
            relations.push(relation.propertyName);
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
                if(store == "database"){
                    let tables = [];
                    let req;
                    let flags = undefined;
                    let d = {};
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
                    if(this.ENTITIES[store] && this.ENTITIES[store].target[action]){
                        res = await this.ENTITIES[store].target[action](data);
                    }else if(API[action]){
                        console.log("CANNOT FIND ENTITY FOR",store,action);
                        res = await API[action](store,data)
                    }
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