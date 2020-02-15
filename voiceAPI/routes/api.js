const {phoneNumbersInputHandler} = require("../public/helpers/AccountHelpers");
const {accountInputHandler} = require("../public/helpers/AccountHelpers");
module.exports = function (app) {

    app.post('/api/testCall', function (req, res) {
        req.getConnection(function (err, connection) {
            const twilio_call = require('../twilio/calls');
            twilio_call.makeCall();

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify('success'));
        });
    });

}; // end of module
