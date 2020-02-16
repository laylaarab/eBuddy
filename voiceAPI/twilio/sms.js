const twilio = require('./client');

function sendMessage(to, from, body) {
    twilio.client.messages.create({
        body: body,
        to: to,  // Text this number
        from: from
    })
        .then((message) => console.log(message.sid));
}

function sendTwilioMessage(to, body) {
    sendMessage(to, twilio.number, body);
}

function recieveMessage() {
}

function checkIfCallAgreed() {

}

module.exports = {
    sendCallRequest: function (to) {
        sendTwilioMessage(to.number, to.name + ' wants to talk! Type \'yes\' to accept, or \'no\' if you aren\'t free.')
    }
};
