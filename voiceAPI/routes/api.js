const sms = require('../twilio/sms');
const MessagingResponse = require('twilio').twiml.MessagingResponse;


module.exports = function (app) {
    app.get('/api/testCall', function (req, res) {
        const twilio_call = require('../twilio/calls');
        twilio_call.makeCall();

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify('success'));
    });

    app.post('/api/sms/callrequest', function (req, res) {
        console.log(req.body.to.number);
        sms.sendCallRequest({
                name: req.body.to.name,
                number: req.body.to.number
            }
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify('success'));
    });

    app.post('/api/sms/reply', function (req, res) {
        const twiml = new MessagingResponse();

        if (req.body.Body === 'yes' || req.body.Body === 'Yes') {
            twiml.message('Connecting you now!');
        } else if (req.body.Body === 'no' || req.body.Body === 'No') {
            twiml.message('No worries. We\'ll connect them to someone else.');
        } else if (req.body.Body === 'fuck you' || req.body.Body === 'Fuck you') {
            twiml.message('Wanna queue up for help?');
        } else {
            twiml.message('No match for input.');
        }

        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    });

};


