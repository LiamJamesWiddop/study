"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { dialogflow, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
dialogApp.intent('Quiz', (conv, { topic }) => {
    console.log(topic);
    conv.close('Your lucky number is 7!');
});
dialogApp.intent('Goodbye', conv => {
    conv.close('See you later!');
});
dialogApp.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`);
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map