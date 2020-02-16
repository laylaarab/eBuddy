const twilio = require('./client');

module.exports = {
    makeCall: function (config) {
        twilio.client.messages.create({
            body: 'Thank you for using Buddy! \n Please take a moment to reply (1-5) on the helpfulness of this call after you have hung-up.',
            to: config.from.number,  // Text this number
            from: twilio.number
        })


    },

    getFeedback: function (config, rate) {

    }

};



