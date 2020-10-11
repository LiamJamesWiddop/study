"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const { dialogflow, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
dialogApp.intent('Quiz_Question_Next', async (conv) => {
    let topic = conv.parameters[`quiz-topic`];
    let question = await api_1.default.getBest(null, 0);
    console.log(question);
    conv.data.question = question[0];
    conv.followup('quiz-question', {
        question: question[0]
    });
});
dialogApp.intent('Quiz_Answer', conv => {
    conv.followup('quiz-answer-followup', {
        answer: conv.data.question.body.answer
    });
});
dialogApp.intent('Quiz_Answer_Followup', conv => {
    let correct = conv.parameters[`quiz-topic`];
    console.log("CORRECT", correct);
    let followup = 'quiz-answer-correct';
    if (!correct)
        followup = 'quiz-answer-incorrect';
    conv.followup(followup, {});
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map