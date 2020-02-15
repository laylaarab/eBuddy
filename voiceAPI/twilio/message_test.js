const twilio = require('twilio');
let accountSid = 'AC1e4b7cc73e473fe07753c1e2f25fa2c8'; // Your Account SID from www.message_test.com/console
let authToken = '4b4207831b73f97a4cd8afc77a982af6';   // Your Auth Token from www.message_test.com/console

let client = new twilio(accountSid, authToken);

module.exports = {
    message: function () {
        client.messages.create({
            body: 'Hello from Node',
            to: '+15877167898',  // Text this number
            from: '+19738213496'
        })
            .then((message) => console.log(message.sid));
    }
};


