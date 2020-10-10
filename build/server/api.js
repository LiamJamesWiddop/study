"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new class API {
    constructor() {
        this.ENTITIES = [];
    }
    async createQuestions(store, data) {
        let newQuestions = [];
        let previousQuestions = await this.ENTITIES[`question`].target.find({ entry_id: data.entry_id });
        for (let field of data.fields) {
            let q = previousQuestions.find(q => {
                if (q.field == field)
                    return q;
            });
            if (!q && field !== "name") {
                let down = await this.createEntity(`question`, {
                    table: data.table,
                    entry_id: data.entry_id,
                    field
                });
                newQuestions.push(down);
                let up = await this.createEntity(`question`, {
                    table: data.table,
                    entry_id: data.entry_id,
                    field,
                    direction: false,
                });
                newQuestions.push(up);
            }
            else {
                newQuestions.push(q);
            }
        }
        for (let oldQuestion of previousQuestions) {
            if (!data.fields.includes(oldQuestion.field)) {
                oldQuestion.remove();
            }
        }
        return newQuestions;
    }
    async createEntity(store, data) {
        let entityFunction = this.ENTITIES[store].target;
        let entity = await entityFunction.create();
        for (let [key, value] of Object.entries(data)) {
            entity[key] = value;
        }
        return await entity.save();
    }
    async getBest(store, id) {
        let entries = await this.ENTITIES[`question`].target.whereNot(id);
        entries = entries.sort((a, b) => this.sortByAttempt(a, b));
        let questions = [];
        for (let i = 0; i < 1; i++) {
            let question = entries[i];
            let data = await this.ENTITIES[question.table].target.findOne({ id: question.entry_id });
            if (question.direction) {
                questions.push({
                    question_id: question.id,
                    entry_id: data.id,
                    entry_table: question.table,
                    nextAttemptDelta: question.nextAttemptDelta,
                    body: {
                        question: `What is the ${question.field} of the following ${question.table}:`,
                        body: `${data.name}`,
                        answer: `${data[question.field]}`
                    }
                });
            }
            else {
                questions.push({
                    question_id: question.id,
                    entry_id: data.id,
                    entry_table: question.table,
                    nextAttemptDelta: question.nextAttemptDelta,
                    body: {
                        question: `What ${question.table} does the following ${question.field} pertain to?`,
                        body: `${data[question.field]}`,
                        answer: `${data.name}`
                    }
                });
            }
        }
        return questions;
    }
    sortByAttempt(a, b) {
        let aVal = a['lastAttempt'] + a['nextAttemptDelta'];
        let bVal = b['lastAttempt'] + b['nextAttemptDelta'];
        if (aVal < bVal) {
            return -1;
        }
        if (aVal > bVal) {
            return 1;
        }
        return 0;
    }
    async questionAttempt(store, data) {
        let attemptTime = new Date().getTime();
        let attempt = await this.createEntity(`attempt`, {
            time: attemptTime,
            correct: data.correct,
        });
        let question = await this.ENTITIES[`question`].target.findOne({ id: data.question_id });
        if (question.attempt) {
            question.attempt.push(attempt);
        }
        else {
            question.attempt = [attempt];
        }
        if (question.nextAttemptDelta) {
            if (data.correct)
                question.nextAttemptDelta * 2;
            else
                Math.max(question.nextAttemptDelta / 2, 60000);
        }
        else {
            question.nextAttemptDelta = 150000;
        }
        let correctRatio = 0;
        for (let attempt of question.attempt) {
            correctRatio += attempt.correct;
        }
        question.correctRatio = correctRatio / (question.attempt.length);
        question.lastAttempt = attemptTime;
        return await this.ENTITIES[`question`].target.save(question);
    }
};
//# sourceMappingURL=api.js.map