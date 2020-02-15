const twilio = require('client');

module.exports = {
    message: function () {
        twilio.client.calls
            .create({
                url: 'http://demo.twilio.com/docs/voice.xml',
                to: '+14155551212',
                from: twilio.number
            })
            .then(call => console.log(call.sid));
    }
};

