var express = require('express');
var packageInfo = require('./package.json');
var https = require("https");

setInterval(function() {
    https.get("https://ashansins-6.herokuapp.com/");
}, 300000); // every 5 minutes (300000)
var app = express();

app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT  || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Web server started at http://%s:%s', host, port);
});