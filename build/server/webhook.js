"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const { dialogflow, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
dialogApp.intent('Quiz', async (conv) => {
    console.log(conv.parameters[`quiz-topic`]);
    let question = await api_1.default.getBest(null, 0);
    console.log(question);
    conv.followup('quiz-question', {
        question: question[0]
    });
});
dialogApp.intent('Quiz_Answer', conv => {
    console.log(conv);
    conv.close(`Ooh Ahh Glen McGra`);
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map