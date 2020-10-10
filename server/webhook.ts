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
    conv.followup('AskQuestion', question[0]);
    // Respond with the user's lucky number and end the conversation.
});

// Intent in Dialogflow called `Goodbye`
dialogApp.intent('Goodbye', conv => {
    conv.close('See you later!')
})

dialogApp.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`)
})

export default dialogApp;