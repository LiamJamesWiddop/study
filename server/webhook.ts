import API from "./api"
import { parse } from 'node-html-parser';

const {
    dialogflow,
    BasicCard,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow();

dialogApp.intent('Quiz_Topic', async (conv) => {
    conv.data.topic = conv.parameters[`quiz-topic`];
    console.log("Topic received", conv.data.topic);
    conv.followup('quiz-question-next', {});
});

dialogApp.intent('Quiz_Question_Next', newQuestion);
dialogApp.intent('Quiz_Answer - correct', newQuestion);
dialogApp.intent('Quiz_Answer - incorrect', newQuestion);

async function newQuestion(conv){

    if(conv.data.lastAnswer){
        if(conv.data.lastAnswer){
            conv.ask("Great job!");
        }else{
            conv.ask("Maybe next time.");
        }
    }
    conv.ask("Fetching a question");
    
    let question = await API.getBest(null,0)
    console.log(question);
    conv.data.question = question[0];
    
    // invokes a quiz question
    conv.followup('quiz-question', {
        question:question[0]
    });
}

dialogApp.intent('Quiz_Answer', conv => {
    let htmlAnswer = parse(conv.data.question.body.answer);
    let images = htmlAnswer.querySelectorAll('img');
    let text = htmlAnswer.innerText;
    
    for(let image of images){
        htmlAnswer.removeChild(image);
    }
    conv.data.question.body.answer = text;
    conv.ask("We were looking for:"); 
    conv.ask(text);

    if(images){
        conv.ask(new BasicCard({
            image: new Image({
                url: images[0].getAttribute('src'), //url of your image.
                alt: images[0].getAttribute('alt'),
            }),
        }))
    }

    conv.ask("Did you get it right?");
})

dialogApp.intent('Quiz_Answer_Followup', conv => {
    console.log("Answer followup filled - asked if right or wrong");

    let correct = conv.parameters[`correct`];
    console.log("CORRECT",correct);
    
    let followup = 'quiz-answer-correct';
    if(!correct) followup = 'quiz-answer-incorrect'

    conv.data.lastAnswer = correct;
    console.log("Followup",followup);
    conv.followup(followup,{});
})

export default dialogApp;