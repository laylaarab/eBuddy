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
        console.log('Received rating from: ' + config.from.number);
        console.log('Received rating to: ' + config.to.number);
        console.log('Value: ' + rate);

        //
        // const https = require('https');
        //
        // const data = JSON.stringify({
        //     config,
        //     rate: rate
        // })
        // https://postb.in/1581869423144-6248265572357
        // const options = {
        //     hostname: 'postb.in',
        //     port: 443,
        //     path: '/1581869423144-6248265572357',
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Content-Length': data.length
        //     }
        // }

        const options_send = {
            "client-phone": config.from.number,
            "volunteer-phone": config.to.number,
            "client-rating": rate
        }

        var request = require('request');

        var options = {
            uri: 'https://buddy.us-west-2.elasticbeanstalk.com/call/result/',
            method: 'POST',
            json: options_send
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body.id) // Print the shortened url.
            }
        });


    }

};



