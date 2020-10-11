import API from "./api"

const {
    dialogflow,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow();

dialogApp.intent('Quiz', async (conv) => {
    console.log(conv.parameters[`quiz-topic`]);
    let question = await API.getBest(null,0)
    console.log(question);

    // invokes a quiz question
    conv.followup('quiz-question', {
        question:question[0]
    });
});

dialogApp.intent('Quiz_Answer', conv => {
    console.log(JSON.stringify(conv.arguments));
    console.log("+++++++");
    console.log("+++++++");
    console.log("+++++++");
    console.log(JSON.stringify(conv.body.queryResult));
    conv.close(`Ooh Ahh Glen McGra`)
})

export default dialogApp;