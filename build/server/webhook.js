"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
exports.default = new class Webhook {
    mounted() {
        this.getBest();
    }
    async getBest() {
        let ignore = 0;
        return await api_1.default.getBest(null, ignore);
    }
};
//# sourceMappingURL=webhook.js.map