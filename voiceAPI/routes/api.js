const sms = require('../twilio/sms');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const buddies = require('../twilio/buddies');
const buddiesMap = buddies.buddiesMap;
const namesMap = buddies.namesMap;
const twilio_call = require('../twilio/calls');
const twilio_transcript = require('../twilio/transcripts');
const twilio_rating = require('../twilio/rating');

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
            if (buddiesMap.has(req.body.From)) {
                twiml.message('No worries. We\'ll connect them to someone else.');
                // delete buddies from maps
                let callerNumber = buddiesMap.get(req.body.From);
                buddies.deleteBuddyPair(req.body.From, callerNumber);
            } else {
                twiml.message('It doesn\'t seem like you have a call waiting!');
            }
        } else if (body === 'fuck you' || body === 'Fuck you') {
            twiml.message('Wanna queue up for help?');
        } else if (body === '418') {
            twiml.message('I\'m a teapot (send nudes pls)');
        } else if (body === '1' || body === '0' || body === '1' || body === '2' || body === '3' || body === '4' || body === '5') {
            if (buddies.previousBuddies.get(req.body.From) != null) {
                twiml.message('Thanks for your contribution!');
                let recipients = {
                    to: {
                        name: namesMap.get(req.body.From),
                        number: req.body.From
                    },
                    from: {
                        name: namesMap.get(buddies.previousBuddies.get(req.body.From)),
                        number: buddies.previousBuddies.get(req.body.From)
                    }
                };
                twilio_rating.getFeedback(recipients, body)
                // make API call to Shamez
            } else {
                twiml.message('It doesn\'t seem like you have a call waiting!');
            }
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

    app.put('/api/xml/conference_transcript', (request, response) => {
        // console.log(request.body);
        // let body_test = JSON.stringify(request.body);
        // let re = /(?:"url":")(.*?)(?:")/;
        // const found = request.body.toString().match(re);
        // let test = JSON.stringify(request.body).AddOns;
        // console.log(test);
        // // console.log(JSON.parse(body_test).status);

        const url = "https://api.twilio.com/2010-04-01/Accounts/AC1e4b7cc73e473fe07753c1e2f25fa2c8/Recordings/REbb928f5b7792e7eed2c33eaa8df043da/AddOnResults/XRaa6dce8d70147bc938c1eb5e1315a381/Payloads/XH7099450cdd0562f5fdbf9192e98a7d1f/Data";

        // twilio_transcript.getTranscript(request.body.AddOns.results.voicebase_transcription.payload[0].url);
        twilio_transcript.getTranscript(url);

        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify('success'));
    });


}; // end of module
