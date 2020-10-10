"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { dialogflow, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
dialogApp.intent('Quiz', (conv) => {
    console.log(conv.parameters[`quiz-topic`]);
    conv.followup('AskQuestion', {
        date: new Date().toISOString(),
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