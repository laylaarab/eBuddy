const twilio = require('twilio');
const config = require('../config');

module.exports = twilio(config.twilio.sid, config.twilio.token);

