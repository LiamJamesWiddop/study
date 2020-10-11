import API from "./api"
import { parse } from 'node-html-parser';

const {
    dialogflow,
    BasicCard,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow();


let newQuestion = async conv =>{

    conv.data.lastAnswer = 'correct';
    let correct = conv.parameters[`correct`];
    console.log(conv.parameters[`correct`],correct,correct=='true');
    if(correct == 'true') {
        conv.ask("Well done!");
        console.log(conv.data.question);
        console.log({question_id:conv.data.question.question_id,correct:true});
        await API.questionAttempt(null,{question_id:conv.data.question.question_id,correct:true})
    }else if(correct == 'false'){
        conv.ask("Oh well, maybe next time!");
        await API.questionAttempt(null,{question_id:conv.data.question.question_id,correct:false})
    }

    conv.ask("Here comes a question!");
    let question = await API.getBest(null,0)
    conv.data.question = question[0];

    // parse html out of question
    let question_html = parse(conv.data.question.body.question);
    let question_images = question_html.querySelectorAll('img');
    for(let image of question_images){
        question_html.removeChild(image);
    }
    let question_text = question_html.innerText;
    conv.data.question.body.question = question_text;

    // parse html out of question
    let body_html = parse(conv.data.question.body.body);
    let body_images = body_html.querySelectorAll('img');
    for(let image of body_images){
        question_html.removeChild(image);
    }
    let body_text = body_html.innerText;
    conv.data.question.body.body = body_text;

    // display question
    conv.ask(`${conv.data.question.body.question} ${conv.data.question.body.body}?`)
}

dialogApp.intent('Quiz_Topic', newQuestion);
dialogApp.intent('Quiz_Another',newQuestion);
dialogApp.intent('Quiz_Answer_Followup', newQuestion)

dialogApp.intent('Quiz_Answer', conv => {
    let htmlAnswer = parse(conv.data.question.body.answer);
    let images = htmlAnswer.querySelectorAll('img');
    let text = htmlAnswer.innerText;
    
    for(let image of images){
        htmlAnswer.removeChild(image);
    }
    conv.data.question.body.answer = text;
    conv.ask(`We were looking for: ${text}`); // this Simple Response is necessary
    if(images.length > 0){
        conv.ask(new BasicCard({
            image: new Image({
                url: images[0].getAttribute('src'), //url of your image.
                alt: images[0].getAttribute('alt'),
            }),
        }))
    }
    conv.ask("Did you get it right?"); // this Simple Response is necessary
})


export default dialogApp;