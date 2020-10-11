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

dialogApp.intent('Quiz_Question_Next', async (conv) => {
    console.log("Asked for next question");
    
    let question = await API.getBest(null,0)
    console.log(question);
    conv.data.question = question[0];
    // invokes a quiz question
    conv.followup('quiz-question', {
        question:question[0]
    });
});

dialogApp.intent('Quiz_Answer', conv => {
    let htmlAnswer = parse(conv.data.question.body.answer);

    console.log("HTML",htmlAnswer);
    let images = htmlAnswer.querySelectorAll('img');
    let text = htmlAnswer.innerText;
    
    for(let image of images){
        htmlAnswer.removeChild(image);
    }
    console.log("NEW HTML",htmlAnswer);

    console.log("IMAGES",images);
    console.log("TEXT",text);
    
    conv.data.question.body.answer = text;
    
    conv.ask(text); // this Simple Response is necessary
    conv.ask(new BasicCard({
        image: new Image({
            url: images[0].getAttribute('src'), //url of your image.
            alt: images[0].getAttribute('alt'),
        }),
    }))
   
    
    // conv.followup('quiz-answer-display', {
    //     answer:conv.data.question.body.answer
    // });
})

dialogApp.intent('Quiz_Answer_Followup', conv => {
    console.log("Answer followup filled - asked if right or wrong");

    let correct = conv.parameters[`correct`];
    console.log("CORRECT",correct);
    
    let followup = 'quiz-answer-correct';
    if(!correct) followup = 'quiz-answer-incorrect'

    console.log("Followup",followup);
    conv.followup(followup,{});
})

export default dialogApp;