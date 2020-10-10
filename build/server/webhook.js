"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { dialogflow, Image, } = require('actions-on-google');
const dialogApp = dialogflow({ debug: true });
dialogApp.intent('Quiz', (conv, { topic }) => {
    console.log(topic);
    conv.close('Your lucky number is 7!');
});
dialogApp.intent('Default Welcome Intent', conv => {
    conv.ask('Hi, how is it going?');
    conv.ask(`Here's a picture of a cat`);
    conv.ask(new Image({
        url: 'https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg',
        alt: 'A cat',
    }));
});
dialogApp.intent('Goodbye', conv => {
    conv.close('See you later!');
});
dialogApp.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`);
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map