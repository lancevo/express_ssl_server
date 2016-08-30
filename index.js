var express = require('express');
var helmet = require('helmet'); //https://expressjs.com/en/advanced/best-practice-security.html
var cors = require('cors'); // https://github.com/expressjs/cors
var app = express();
var https = require('https');
var http = require('http');
var fs = require('fs');

var HTTP_PORT = 7777, HTTPS_PORT = 4443;

var key = '/etc/letsencrypt/live/example.com/privkey.pem';
var cert = '/etc/letsencrypt/live/example.com/fullchain.pem'; 

var sslOptions = {
    key: fs.readFileSync(key),
    cert: fs.readFileSync(cert)
}

var whitelist = ['http://localhost:8000','https://www.mywebsite.com'];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
    },
    optionsSuccessStatus: 200
}

app.use(helmet());
app.use(cors(corsOptions));

app.get('/', function(req,res){
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.send('Hello ',ip);
  
});

console.log('Running HTTP', HTTP_PORT, 'HTTPS', HTTPS_PORT)
http.createServer(app).listen(HTTP_PORT);
https.createServer(sslOptions,app).listen(HTTPS_PORT);
