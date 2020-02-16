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

function markCallAgreed() {

}

module.exports = {
    sendCallRequest: function (to, fromBuddy) {
        sendTwilioMessage(fromBuddy.number, fromBuddy.name + ' wants to talk! Type \'yes\' to accept, or \'no\' if you aren\'t free.')
    }
};
