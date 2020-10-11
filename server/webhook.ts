import API from "./api"

const {
    dialogflow,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow();

dialogApp.intent('Quiz_Question_Next', async (conv) => {
    let topic = conv.parameters[`quiz-topic`];
    let question = await API.getBest(null,0)
    console.log(question);
    conv.data.question = question[0];
    // invokes a quiz question
    conv.followup('quiz-question', {
        question:question[0]
    });
});

dialogApp.intent('Quiz_Answer', conv => {
    conv.followup('quiz-answer-followup', {
        answer:conv.data.question.body.answer
    });
})

dialogApp.intent('Quiz_Answer_Followup', conv => {
    let correct = conv.parameters[`quiz-topic`];
    console.log("CORRECT",correct);
    
    let followup = 'quiz-answer-correct';
    if(!correct) followup = 'quiz-answer-incorrect'
    
    conv.followup(followup,{});
})

export default dialogApp;