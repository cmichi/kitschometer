var express = require('express');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;

var app = express();
app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;

	app.use(express.bodyParser());
	//app.use(express.cookieParser());
	//app.use(express.session({ secret: config.session_secret }));
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/static'));
});

var server = require('http').createServer(app);
server.listen(process.env.PORT || 8001, function() {
	console.log('Listening on port ' + server.address().port);
});

app.get('/', function(req, res) {
	getCounter(function(counterObj) {
		console.log(JSON.stringify(counterObj));
		res.render('index', {counter: counterObj});
	});
});

app.get('/vote/:whatfor', function(req, res) {
	if (req.params.whatfor === "kunst") {
		countVote("kunst", function() {
			getCounter(function(counterObj) {
				res.render('voted', {whatfor: "kunst", counter: counterObj});
			});
		});
	} else if (req.params.whatfor === "kitsch") {
		countVote("kitsch", function() {
			getCounter(function(counterObj) {
				res.render('voted', {whatfor: "kitsch", counter: counterObj});
			});
		});
	} else {
		console.log("redirecting..");
		res.redirect("/");
	}
});

app.use(function(req,res){
	res.render('404');
});

(function initApp() {
	if (!fs.existsSync('./data/')) {
		try { 
			fs.mkdirSync('./data/'); 
		} catch (e) {
			throw new Error(e);
		}
	}
})();

function getCounter(cb) {
	getCounterFor("kunst", function(kunstCounter) {
		getCounterFor("kitsch", function(kitschCounter) {
			var obj = {
				  kunst: kunstCounter
				, kitsch: kitschCounter
				, total: kunstCounter + kitschCounter
			};
			cb(obj);
		});
	});
}

function getCounterFor(whatfor, cb) {
	fs.exists("./data/" + whatfor + ".counter", function (exists) {
		if (exists) {
			var cmd = "cat ./data/" + whatfor + ".counter | wc -l";
			child = exec(cmd, function (error, stdout, stderr) {
				//console.log('stdout: ' + stdout);
				//console.log('stderr: ' + stderr);

				if (error !== null) {
					console.log('exec error: ' + error);
				} 
				
				cb(parseInt(stdout));
			});
		} else {
			cb(0);
		}
	});
}

function countVote(whatfor, cb) {
	try {
		fs.appendFileSync("./data/" + whatfor + ".counter", "1\n");
		cb();
	} catch (e) {
		throw new Error(e);
		res.render("500", {msg: JSON.stringify(err)} );
	};
}

