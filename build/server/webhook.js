"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const { dialogflow, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
dialogApp.intent('Quiz', async (conv) => {
    console.log(conv.parameters[`quiz-topic`]);
    let question = await api_1.default.getBest(null, 0);
    console.log(question);
    conv.followup('AskQuestion', {
        question: question[0]
    });
});
dialogApp.intent('Goodbye', conv => {
    conv.close('See you later!');
});
dialogApp.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`);
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map