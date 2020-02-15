module.exports = function (app) {
    app.get('/api/testCall', function (req, res) {
        req.getConnection(function (err, connection) {
            const twilio_call = require('../twilio/calls');
            twilio_call.makeCall();

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify('success'));
        });
    });

}; // end of module
