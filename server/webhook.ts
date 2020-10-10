import API from "./api"

const {
    dialogflow,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow();

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
dialogApp.intent('Quiz', async (conv) => {
    console.log(conv.parameters[`quiz-topic`]);
    let question = await API.getBest(null,0)
    console.log(question);
    conv.followup('quiz-question', {
        question:question[0]
    });
    // Respond with the user's lucky number and end the conversation.
});

// Intent in Dialogflow called `Goodbye`
dialogApp.intent('Quiz_Question_Answer', conv => {
    console.log(conv);
    conv.close(`Ooh Ahh Glen McGra`)
})

export default dialogApp;