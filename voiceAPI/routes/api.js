const sms = require('../twilio/sms');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const buddies = require('../twilio/buddies');
const buddiesMap = buddies.buddiesMap;
const namesMap = buddies.namesMap;
const twilio_call = require('../twilio/calls');

module.exports = function (app) {
    app.get('/api/testCall1', function (req, res) {

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

    app.post('/api/sms/callrequest', function (req, res) {
        let to = req.body.to;
        let from = req.body.from;
        buddies.addBuddyPair(to, from);
        sms.sendCallRequest({
                name: to.name,
                number: to.number
            },
            {
                name: from.name,
                number: to.number
            }
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify('success'));
    });

    app.post('/api/sms/reply', function (req, res) {
        let body = req.body.Body;
        const twiml = new MessagingResponse();
        if (body === 'yes' || body === 'Yes') {
            if (buddiesMap.has(req.body.From)) {
                twiml.message('Connecting you now!');
                let recipients = {
                    to: {
                        name: namesMap.get(req.body.From),
                        number: req.body.From
                    },
                    from: {
                        name: namesMap.get(buddiesMap.get(req.body.From)),
                        number: buddiesMap.get(req.body.From)
                    }
                };
                twilio_call.makeCall(recipients);
                // delete buddies from maps
                let callerNumber = buddiesMap.get(req.body.From);
                buddies.deleteBuddyPair(req.body.From, callerNumber);
            } else {
                twiml.message('It doesn\'t seem like you have a call waiting!');
            }
        } else if (body === 'no' || body === 'No') {
            twiml.message('No worries. We\'ll connect them to someone else.');
            if (buddiesMap.has(req.body.From)) {
                twiml.message('Connecting you now!');
                // delete buddies from maps
                let callerNumber = buddiesMap.get(req.body.From);
                buddies.deleteBuddyPair(req.body.from, callerNumber);
            }
        } else if (body === 'fuck you' || body === 'Fuck you') {
            twiml.message('Wanna queue up for help?');
        } else {
            twiml.message('No match for input.');
        }

        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    });

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
        const dial = twiml.dial({
            record: 'record-from-answer-dual'
        });

        dial.conference(conf_id, conf_options);

        // Render the response as XML in reply to the webhook request
        response.type('text/xml');
        response.send(twiml.toString());
    });

    app.post('/api/xml/conference_transcript', (request, response) => {
         console.log(request.body.AddOns);

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify('success'));
    });


}; // end of module
