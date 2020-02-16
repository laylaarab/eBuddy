const sms = require('../twilio/sms');

module.exports = function (app) {
    app.get('/api/testCall', function (req, res) {
            const twilio_call = require('../twilio/calls');
            twilio_call.makeCall();

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
}; // end of module
