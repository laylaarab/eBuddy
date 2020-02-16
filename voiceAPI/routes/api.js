const sms = require('../twilio/sms');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

module.exports = function (app) {
    app.get('/api/testCall1', function (req, res) {
            const twilio_call = require('../twilio/calls');

            const sample_config = {
                to: {
                    name: 'Evan',
                    number: '+15872579730'
                },
                from: {
                    name: 'Layla',
                    number: '+15877167898'
                }
            };

            twilio_call.makeCall(sample_config);

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify('success'));
    });

    app.get('/api/testCall2', function (req, res) {
        const twilio_call = require('../twilio/calls');
        twilio_call.makeCall('+15877167898');

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify('success'));
    });

    app.post('/api/requestcall', function (req, res) {
        console.log(req.body.to.number);
        sms.sendCallRequest({
                name: req.body.to.name,
                number: req.body.to.number
            }
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify('success'));
    })



// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
    app.post('/api/xml/conference/:mod/:conf_id', (request, response) => {
        const mod = request.params.mod;
        const conf_id = request.params.conf_id;
        let conf_options;


        // Use the Twilio Node.js SDK to build an XML response
        const twiml = new VoiceResponse();

        if (mod === 'm') {
            twiml.say("Welcome! Thank you for volunteering!");
            conf_options = {
                startConferenceOnEnter: true,
                endConferenceOnExit: true,
            };
        } else {
            // Otherwise have the caller join as a regular participant
            twiml.say("Welcome! Thank you for choosing Buddy!");
            conf_options = {
                startConferenceOnEnter: false,
                endConferenceOnExit: true,
            };
        }

        twiml.say("The other party will join shortly.");
        twiml.say({
            voice: 'man',
        }, "PLEASE NOTE: This call will be recorded for profiling purposes.");

        // Start with a <Dial> verb
        const dial = twiml.dial();


        dial.conference(conf_id, conf_options);

        // Render the response as XML in reply to the webhook request
        response.type('text/xml');
        response.send(twiml.toString());
    });



}; // end of module
