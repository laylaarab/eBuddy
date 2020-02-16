const config = require('../config');
const twilio = require('twilio');

module.exports.client = twilio(config.config_t.twilio.sid, config.config_t.twilio.token);
module.exports.number = '+15873180263';

