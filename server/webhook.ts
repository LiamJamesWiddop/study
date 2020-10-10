const dialogflow = require('dialogflow');
const dialogApp = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
dialogApp.intent('Quiz', (conv, {topic}) => {
    console.log(topic);
    // Respond with the user's lucky number and end the conversation.
    conv.close('Your lucky number is 7!');
});

export default dialogApp;