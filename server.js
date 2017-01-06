// set up ======================================================================
//var staticdir = process.env.NODE_ENV === 'develop' ? 'dist.dev' : 'dist.prod';
var staticdir ='dist.dev';

var express = require('express');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var app = express(); 						// create our app w/ express
var port = process.env.PORT || 8080; 				// set the port
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/' + staticdir));
app.use(express.static('./client')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ limit: '10000000', extended: true }));
app.use(bodyParser.json({ limit: '10000000', defer: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

require('./server/routes.js')(app);

app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: './'+staticdir }); // load the single view file (angular will handle the page changes on the front-end)
});


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
