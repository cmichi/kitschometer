var net = require("net");

var socket = net.createConnection(1337, "192.168.1.105");
socket.on("data", function(data) {
	console.log("" + data);
});
