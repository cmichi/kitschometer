var express = require('express');
var http = require('http');
var fs = require('fs');
var exec = require('child_process').exec;

var io = require('socket.io').listen(8002);
io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

var app = express();
app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;

	app.use(express.bodyParser());
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
		res.render('index', {counter: counterObj});
	});
});

app.get('/vote/:whatfor', function(req, res) {
	if (req.params.whatfor === "kunst") {
		countVote("kunst", function() {
			getCounter(function(counterObj) {
				res.json({whatfor: "kunst", counter: counterObj});
			});
		});
	} else if (req.params.whatfor === "kitsch") {
		countVote("kitsch", function() {
			getCounter(function(counterObj) {
				res.json({whatfor: "kitsch", counter: counterObj});
			});
		});
	} else {
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
	setInterval(function() {readButtons()}, 500);
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
			var child = exec(cmd, function (error, stdout, stderr) {
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

function readButtons() {
	var cmd = "telnet 192.168.1.105 1337";
	var child = exec(cmd, function (error, stdout, stderr) {
		if (stdout) {
			var foo = stdout.split("\n");
			console.log(JSON.stringify(foo));
			if (foo[3] == undefined) return;

			for (var i in foo) {
				var e = foo[i];
				//console.log(foo[3]);

				if (foo[i] == "128")
					io.sockets.emit('vote', {whatfor: 'kunst'});
				else if (foo[i] == "64")
					io.sockets.emit('vote', {whatfor: 'kitsch'});
			}
		}
		//console.log('stdout: ' + stdout);
		//console.log('stderr: ' + stderr);

		//if (error !== null) {
			//console.log('exec error: ' + error);
		//} 
		
		//cb(parseInt(stdout));
	});
	//child.stdout.on('data', function(data) { 
		//process.stdout.write(data); 
		//io.sockets.emit('news', data);
	//});
}
