const express = require('express');
const {log, ExpressAPILogMiddleware} = require('@rama41222/node-logger');
const twilio = require('./twilio/message_test');
const fs = require('fs');
const https = require('https');

const app = express();

app.get('/', function (req, res) {
    twilio.message();
    res.send('hello world')

});

https.createServer({
    key: fs.readFileSync('cert.key'),
    cert: fs.readFileSync('cert.pem')
}, app)
    .listen(443, function () {
        console.log('Example app listening on port 3000! Go to https://localhost:3000/')
    });

