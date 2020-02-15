const twilio = require('client');

module.exports = {
    makeCall: function () {
        twilio.client.calls
            .create({
                url: 'http://demo.twilio.com/docs/voice.xml',
                to: '+15872579730',
                from: twilio.number
            })
            .then(call => console.log(call.sid));
    }
};

