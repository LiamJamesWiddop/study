"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const node_html_parser_1 = require("node-html-parser");
const { dialogflow, BasicCard, Image, } = require('actions-on-google');
const dialogApp = dialogflow();
let newQuestion = async (conv) => {
    conv.data.lastAnswer = 'correct';
    let correct = conv.parameters[`correct`];
    console.log(conv.parameters[`correct`], correct, correct == 'true');
    let prompt = '';
    if (correct == 'true') {
        prompt = "Well done! ";
        await api_1.default.questionAttempt(null, { question_id: conv.data.question.question_id, correct: true });
    }
    else if (correct == 'false') {
        prompt = "Oh well, maybe next time! ";
        await api_1.default.questionAttempt(null, { question_id: conv.data.question.question_id, correct: false });
    }
    conv.ask(`${prompt}Here comes ${prompt ? 'another' : 'a'} question!`);
    let question = await api_1.default.getBest(null, 0);
    conv.data.question = question[0];
    let question_html = node_html_parser_1.parse(conv.data.question.body.question);
    let question_images = question_html.querySelectorAll('img');
    for (let image of question_images) {
        question_html.removeChild(image);
    }
    let question_text = question_html.innerText;
    conv.data.question.body.question = question_text;
    let body_html = node_html_parser_1.parse(conv.data.question.body.body);
    let body_images = body_html.querySelectorAll('img');
    for (let image of body_images) {
        question_html.removeChild(image);
    }
    let body_text = body_html.innerText;
    conv.data.question.body.body = body_text;
    conv.ask(`${conv.data.question.body.question} ${conv.data.question.body.body}?`);
};
dialogApp.intent('Quiz_Topic', newQuestion);
dialogApp.intent('Quiz_Another', newQuestion);
dialogApp.intent('Quiz_Answer_Followup', newQuestion);
dialogApp.intent('Quiz_Answer', conv => {
    let htmlAnswer = node_html_parser_1.parse(conv.data.question.body.answer);
    let images = htmlAnswer.querySelectorAll('img');
    let text = htmlAnswer.innerText;
    for (let image of images) {
        htmlAnswer.removeChild(image);
    }
    conv.data.question.body.answer = text;
    conv.ask(`We were looking for: ${text}`);
    if (images.length > 0) {
        conv.ask(new BasicCard({
            image: new Image({
                url: images[0].getAttribute('src'),
                alt: images[0].getAttribute('alt'),
            }),
        }));
    }
    conv.ask("Did you get it right?");
});
exports.default = dialogApp;
//# sourceMappingURL=webhook.js.map