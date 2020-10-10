"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const vuex_module_decorators_1 = require("vuex-module-decorators");
let databaseStore = class databaseStore extends vuex_module_decorators_1.VuexModule {
    constructor() {
        super(...arguments);
        this.databaseEntries = [];
        this.dbState = [];
    }
    async find({ promise, payload, callback }) {
        this.databaseEntries = await promise;
        let dbState = [];
        for (let [key, entries] of Object.entries(this.databaseEntries)) {
            let e = entries;
            for (let i = 0; i < e.length; i++) {
                e[i] = { ...e[i], table: key };
                dbState.push(e[i]);
            }
        }
        if (dbState.length == 0) {
            dbState = [{ table: '', name: 'ERROR' }];
        }
        this.dbState = dbState;
        callback(this.dbState);
    }
};
__decorate([
    vuex_module_decorators_1.Mutation,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], databaseStore.prototype, "find", null);
databaseStore = __decorate([
    vuex_module_decorators_1.Module({
        namespaced: true,
        stateFactory: true,
    })
], databaseStore);
exports.default = databaseStore;
//# sourceMappingURL=databaseStore.js.map