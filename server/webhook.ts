import API from "./api"

const {
    dialogflow,
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
    console.log("Answer provided - providing actual answer");

    conv.followup('quiz-answer-followup', {
        answer:conv.data.question.body.answer
    });
})

dialogApp.intent('Quiz_Answer_Followup', conv => {
    console.log("Answer followup filled - asked if right or wrong");

    let correct = conv.parameters[`quiz-topic`];
    console.log("CORRECT",correct);
    
    let followup = 'quiz-answer-correct';
    if(!correct) followup = 'quiz-answer-incorrect'

    conv.followup(followup,{});
})

export default dialogApp;