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
const attempt_1 = require("./attempt");
let Question = class Question extends typeorm_1.BaseEntity {
    static async whereNot(id) {
        let questions;
        if (id) {
            questions = await this.createQueryBuilder("question")
                .where("question.id != :id", { id })
                .getMany();
        }
        else {
            questions = await this.find();
        }
        return questions;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Question.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Question.prototype, "table", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "entry_id", void 0);
__decorate([
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Question.prototype, "field", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "lastAttempt", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "nextAttemptDelta", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Question.prototype, "correctRatio", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], Question.prototype, "direction", void 0);
__decorate([
    typeorm_1.OneToMany(type => attempt_1.default, Attempt => Attempt.question, {
        eager: true,
        cascade: true
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Array)
], Question.prototype, "attempt", void 0);
Question = __decorate([
    typeorm_1.Entity()
], Question);
exports.default = Question;
//# sourceMappingURL=question.js.map