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
const diagnostic_1 = require("./diagnostic");
const drug_1 = require("./drug");
const nonDrug_1 = require("./nonDrug");
const symptom_1 = require("./symptom");
const sign_1 = require("./sign");
let Disease = class Disease extends typeorm_1.BaseEntity {
    static echo() {
        console.log("HI");
        return "hi";
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Disease.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Disease.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Disease.prototype, "pathophysiology", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Disease.prototype, "epidemiology", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Disease.prototype, "onset", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Disease.prototype, "presentation", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Disease.prototype, "treatment", void 0);
__decorate([
    typeorm_1.ManyToMany(type => drug_1.default, Drug => Drug.disease, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Disease.prototype, "drug", void 0);
__decorate([
    typeorm_1.ManyToMany(type => nonDrug_1.default, nonDrug => nonDrug.disease, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Disease.prototype, "nonDrug", void 0);
__decorate([
    typeorm_1.ManyToMany(type => diagnostic_1.default, Diagnostic => Diagnostic.disease, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", diagnostic_1.default)
], Disease.prototype, "diagnostic", void 0);
__decorate([
    typeorm_1.ManyToMany(type => symptom_1.default, Symptom => Symptom.disease, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Disease.prototype, "symptom", void 0);
__decorate([
    typeorm_1.ManyToMany(type => sign_1.default, Sign => Sign.disease, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Disease.prototype, "sign", void 0);
Disease = __decorate([
    typeorm_1.Entity()
], Disease);
exports.default = Disease;
//# sourceMappingURL=disease.js.map