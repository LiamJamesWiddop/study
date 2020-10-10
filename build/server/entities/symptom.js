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
const typeorm_1 = require("typeorm");
const disease_1 = require("./disease");
const drug_1 = require("./drug");
let Symptom = class Symptom extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Symptom.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Symptom.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Symptom.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Symptom.prototype, "epidemiology", void 0);
__decorate([
    typeorm_1.ManyToMany(type => drug_1.default, Drug => Drug.symptom, {
        eager: true
    }),
    __metadata("design:type", Array)
], Symptom.prototype, "drug", void 0);
__decorate([
    typeorm_1.ManyToMany(type => disease_1.default, disease => disease.symptom, {
        eager: true
    }),
    __metadata("design:type", Array)
], Symptom.prototype, "disease", void 0);
Symptom = __decorate([
    typeorm_1.Entity()
], Symptom);
exports.default = Symptom;
//# sourceMappingURL=symptom.js.map