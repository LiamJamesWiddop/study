"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dialogflow = require('dialogflow');
const dialogApp = dialogflow({ debug: true });
dialogApp.intent('Quiz', (conv, { topic }) => {
    console.log(topic);
    conv.close('Your lucky number is 7!');
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map