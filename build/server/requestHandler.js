"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
class RequestHandler {
    constructor(connection) {
        this.ENTITIES = [];
        this.init(connection);
    }
    async init(connection) {
        await this.getConnection(connection);
        await this.getEntities();
    }
    async getConnection(connection) {
        this.CONNECTION = await connection;
    }
    getEntities() {
        if (this.CONNECTION) {
            let EntityMetadatas = this.CONNECTION.entityMetadatas;
            for (let EntityMetadata of EntityMetadatas) {
                let name = (EntityMetadata.name).toLowerCase();
                this.ENTITIES[name] = {
                    target: EntityMetadata.target,
                    relations: this.getRelations(EntityMetadata),
                };
            }
            api_1.default.ENTITIES = this.ENTITIES;
        }
        else {
            console.error("NO CONNECTION");
        }
    }
    getRelations(EntityMetadata) {
        let relations = [];
        for (let relation of EntityMetadata.relations) {
            relations.push(relation.propertyName);
        }
        return relations;
    }
    async POST(store, action, data) {
        try {
            if (action == "new") {
                let entityFunction = this.ENTITIES[store].target;
                let entity = await entityFunction.create();
                for (let [key, value] of Object.entries(data)) {
                    entity[key] = value;
                }
                await entity.save();
                return entity;
            }
            else {
                let res;
                if (store == "database") {
                    let tables = [];
                    let req;
                    let d = {};
                    for (let [key, value] of Object.entries(data)) {
                        if (key == 'tables') {
                            let tableArr = value;
                            for (let table of tableArr) {
                                tables.push(table);
                            }
                        }
                        if (key == 'data') {
                            d = value;
                        }
                    }
                    if (tables.length == 0 && data.length > 0) {
                        tables = data;
                    }
                    res = {};
                    for (let table of tables) {
                        try {
                            let entries = await this.ENTITIES[table].target[req || 'find'](d);
                            res[table] = entries;
                        }
                        catch (err) {
                            throw err;
                        }
                    }
                }
                else {
                    if (this.ENTITIES[store] && this.ENTITIES[store].target[action]) {
                        res = await this.ENTITIES[store].target[action](data);
                    }
                    else {
                        res = await api_1.default[action](store, data);
                    }
                }
                return res;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async webhookTest(req) {
        console.log(req);
        let val = await this.ENTITIES['disease'].target['find']();
        return val;
    }
}
exports.default = RequestHandler;
//# sourceMappingURL=requestHandler.js.map