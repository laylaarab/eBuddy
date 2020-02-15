const twilio = require('twilio');
const config = require('../config');

module.exports.client = twilio(config.twilio.sid, config.twilio.token);
module.exports.number = '+15067028339';

