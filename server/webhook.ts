const {
    dialogflow,
    Image,
} = require('actions-on-google')
const dialogApp = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
dialogApp.intent('Quiz', (conv, {topic}) => {
    console.log(topic);
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is 7!');
});

// Intent in Dialogflow called `Goodbye`
dialogApp.intent('Goodbye', conv => {
    conv.close('See you later!')
})

dialogApp.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`)
})

export default dialogApp;