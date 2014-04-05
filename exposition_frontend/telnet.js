var net = require("net");

var connected = false;

function listen() {
	//try {
		var socket = net.createConnection(1337, "192.168.1.105");
		socket.on("connect", function() {
			connected = true
		});

		socket.on("data", function(data) {
			console.log("" + data);
		});

		socket.on("error", function() {
			//console.log("error");
			handle();
		});

		socket.on("end", function() {
			//console.log("disc");
			handle();
		});
	//} catch (err) {
		//console.log(err);
		//handle();
	//}
}

function handle() {
	connected = false;
	setTimeout(function() {
		if (!connected)
			listen();
	}, 2000);
}

listen();

