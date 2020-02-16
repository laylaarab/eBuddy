const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.get('/', function (req, res) {
    res.send('hello world')
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

require('./routes/api')(app);

https.createServer({
    key: fs.readFileSync('cert.key'),
    cert: fs.readFileSync('cert.pem')
}, app)
    .listen(443, function () {
        console.log('Example app listening on port 3000! Go to https://localhost:3000/')
    });

