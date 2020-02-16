const config = require('../config');
const https = require('https');

module.exports = {
    getTranscript: function (url) {

        var username = config.config_t.twilio.sid;
        var password = config.config_t.twilio.token;
        // var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        var options = {
            host: 'api.twilio.com',
            port: 443,
            path: url.substr(22),
            // authentication headers
            headers: {
                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
            }
        };

//this is the call
        let request = https.get(options, function (res) {
            var body = "";
            res.on('data', function (data) {
                body += data;
            });
            res.on('end', function () {
                //here we have the full response, html or json object
                var parseString = require('xml2js').parseString;
                parseString(body, function (err, result) {
                    require('http').get('http://' + result.TwilioResponse.Data[0].RedirectTo[0].substr(8), (res_t) => {
                        res_t.setEncoding('utf8');
                        res_t.on('data', function (body) {
                            console.log(JSON.parse(body).media.transcripts.text);
                        });
                    });

                });
            })
            res.on('error', function (e) {
                console.log("Got error: " + e.message);
            });
        });

    }

};



