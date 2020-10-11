import API from "./api"
import { parse } from 'node-html-parser';

const {
    dialogflow,
    BasicCard,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow();


let newQuestion = async conv =>{
    let question = await API.getBest(null,0)
    conv.data.question = question[0];
    conv.ask(`${conv.data.question.question}:${conv.data.question.body}?`)
}

dialogApp.intent('Quiz_Topic', newQuestion);
dialogApp.intent('Quiz_Question_Next', newQuestion);
dialogApp.intent('Quiz_Another',conv=>{
    let next = conv.parameters[`next`];
    console.log(conv.parameters[`next`],next,next=='true');
    if(next!=='true'){
        conv.close("Thanks for playing");
    }else{
        conv.ask("Okay, let's do another");
    }
    newQuestion(conv);
});



dialogApp.intent('Quiz_Answer', conv => {
    let htmlAnswer = parse(conv.data.question.body.answer);
    let images = htmlAnswer.querySelectorAll('img');
    let text = htmlAnswer.innerText;
    
    for(let image of images){
        htmlAnswer.removeChild(image);
    }
    conv.data.question.body.answer = text;
    conv.ask(text); // this Simple Response is necessary

    if(images){
        conv.ask(new BasicCard({
            image: new Image({
                url: images[0].getAttribute('src'), //url of your image.
                alt: images[0].getAttribute('alt'),
            }),
        }))
    }
    conv.ask("Did you get it right?"); // this Simple Response is necessary
})

dialogApp.intent('Quiz_Answer_Followup', conv => {
    conv.data.lastAnswer = 'correct';
    let correct = conv.parameters[`correct`];
    console.log(conv.parameters[`correct`],correct,correct=='true');
    if(correct == 'true') {
        conv.ask("Well done!");
    }else{
        conv.ask("Oh well, maybe next time!");
    }
    conv.ask("Another question?");
})

export default dialogApp;