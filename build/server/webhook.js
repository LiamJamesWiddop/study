"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const node_html_parser_1 = require("node-html-parser");
const { dialogflow, BasicCard, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
dialogApp.intent('Quiz_Topic', async (conv) => {
    conv.data.topic = conv.parameters[`quiz-topic`];
    conv.followup('quiz-question-next', {});
});
let newQuestion = async (conv) => {
    let question = await api_1.default.getBest(null, 0);
    conv.data.question = question[0];
    conv.followup('quiz-question', {
        question: question[0]
    });
};
dialogApp.intent('Quiz_Question_Next', newQuestion);
dialogApp.intent('Quiz_Another', conv => {
    let next = conv.parameters[`next`][0];
    console.log(conv.parameters[`next`], next, next == 'true');
    if (next == 'true') {
        conv.followup('quiz-question-next', {});
    }
    else {
        conv.close("Thanks for playing");
    }
});
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
dialogApp.intent('Quiz_Answer_Followup', conv => {
    conv.data.lastAnswer = 'correct';
    let correct = conv.parameters[`correct`][0];
    console.log(conv.parameters[`correct`], correct, correct == 'true');
    let followup = 'quiz-answer-correct';
    if (correct == 'true') {
        followup = 'quiz-answer-incorrect';
        conv.data.lastAnswer = 'incorrect';
    }
    conv.followup(followup, {});
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map