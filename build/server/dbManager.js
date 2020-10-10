"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const fs = require("fs");
exports.default = new class dbManager {
    async connect(id, entities) {
        console.log(entities);
        return await typeorm_1.createConnection({
            type: "sqlite",
            database: `./db/${id}.db`,
            entities: entities,
            synchronize: true
        }).then(async (connection) => {
            console.log("Database connection established");
            this.connection = connection;
            await this.connection.query('PRAGMA foreign_keys=OFF');
            await this.connection.synchronize();
            await this.connection.query('PRAGMA foreign_keys=ON');
            this.createQueryRunner();
            return this.connection;
        }).catch((error) => { console.log(error); });
    }
    createQueryRunner() {
        this.queryRunner = this.connection.createQueryRunner();
    }
    async request(req, data, cb) {
    }
};
//# sourceMappingURL=dbManager.js.map