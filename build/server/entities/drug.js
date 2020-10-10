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
const symptom_1 = require("./symptom");
let Drug = class Drug extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Drug.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Drug.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Drug.prototype, "action", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Drug.prototype, "indications", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Drug.prototype, "sideEffects", void 0);
__decorate([
    typeorm_1.ManyToMany(type => symptom_1.default, Symptom => Symptom.drug, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Drug.prototype, "symptom", void 0);
__decorate([
    typeorm_1.ManyToMany(type => disease_1.default, disease => disease.drug, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Drug.prototype, "disease", void 0);
Drug = __decorate([
    typeorm_1.Entity()
], Drug);
exports.default = Drug;
//# sourceMappingURL=drug.js.map