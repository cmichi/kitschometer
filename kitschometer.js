var config = require('./config_local.js');
var express = require('express');
var http = require('http');

var app = express();
app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: config.session_secret }));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/static'));
});

var server = require('http').createServer(app);
server.listen(process.env.PORT || 8001, function() {
	console.log('Listening on port ' + server.address().port);
});

app.get('/', function(req, res) {
	res.render('index', {});
});

app.get('/vote/:whatfor', function(req, res) {
	console.log("foo " + req.params.whatfor)

	if (req.params.whatfor === "kunst") {
		countVote(function() {
			console.log("rendering");
			if (!res)
				console.error("oh no")
			res.render('voted', {whatfor: "kunst"});
		});
	} else if (req.params.whatfor === "kitsch") {
		countVote(function() {
			console.log("rendering");
			res.render('voted', {whatfor: "kitsch"});
		});
	} else {
		console.log("redirecting..");
		res.redirect("/");
	}
});

function countVote(cb) {
	console.log("counted");
	cb();
}

app.use(function(req,res){
	res.render('404');
});

(function initApp() {
	// init
})();
