const client = require('./client');

module.exports = {
    message: function () {
        client.client.messages.create({
            body: 'Hello from Node',
            to: '+15877167898',  // Text this number
            from: '+19738213496'
        })
            .then((message) => console.log(message.sid));
    }
};
