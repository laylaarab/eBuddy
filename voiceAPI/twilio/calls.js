const twilio = require('./client');

module.exports = {
    makeCall: function (config) {

        //
        // const sample_config = {
        //     to: {
        //         name: 'Evan',
        //         number: '+15872579730'
        //     },
        //     from: {
        //         name: 'Layla',
        //         number: '+15877167898'
        //     }
        // };
        let conference_name = 'CON_' + config.to.name + config.to.number + '__' + config.from.name + config.from.number;

        twilio.client.calls.create({
                url: 'https://krul.ca/api/xml/conference/p/'+conference_name,
                to: config.from.number,
                from: twilio.number
            }).then(twilio.client.calls.create({
            url: 'https://krul.ca/api/xml/conference/m/'+conference_name,
            to: config.to.number,
            from: twilio.number
        }));
    }


};



