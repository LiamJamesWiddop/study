"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const node_html_parser_1 = require("node-html-parser");
const { dialogflow, BasicCard, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
let newQuestion = async (conv) => {
    let next = conv.parameters[`next`];
    console.log(conv.parameters[`next`], next, next == 'true');
    if (!next || next == 'true') {
        conv.ask("Okay, let's do another");
        let question = await api_1.default.getBest(null, 0);
        conv.data.question = question[0];
        conv.ask(`${conv.data.question.body.question} ${conv.data.question.body.body}?`);
    }
    else {
        conv.close("Thanks for playing");
    }
};
dialogApp.intent('Quiz_Topic', newQuestion);
dialogApp.intent('Quiz_Another', newQuestion);
dialogApp.intent('Quiz_Answer', conv => {
    let htmlAnswer = node_html_parser_1.parse(conv.data.question.body.answer);
    let images = htmlAnswer.querySelectorAll('img');
    let text = htmlAnswer.innerText;
    for (let image of images) {
        htmlAnswer.removeChild(image);
    }
    conv.data.question.body.answer = text;
    conv.ask(text);
    if (images) {
        conv.ask(new BasicCard({
            image: new Image({
                url: images[0].getAttribute('src'),
                alt: images[0].getAttribute('alt'),
            }),
        }));
    }
    conv.ask("Did you get it right?");
});
dialogApp.intent('Quiz_Answer_Followup', async (conv) => {
    conv.data.lastAnswer = 'correct';
    let correct = conv.parameters[`correct`];
    console.log(conv.parameters[`correct`], correct, correct == 'true');
    if (correct == 'true') {
        conv.ask("Well done!");
        console.log({ question_id: conv.data.question.id, correct: true });
        await api_1.default.questionAttempt(null, { question_id: conv.data.question.id, correct: true });
    }
    else {
        conv.ask("Oh well, maybe next time!");
        await api_1.default.questionAttempt(null, { question_id: conv.data.question.id, correct: false });
    }
    conv.ask("Another question?");
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map