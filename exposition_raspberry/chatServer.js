var exec = require('child_process').exec;

// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer(function (socket) {

  // Identify this client
  socket.name = socket.remoteAddress + ":" + socket.remotePort 

  // Put this new client in the list
  clients.push(socket);

  // Send a nice welcome message and announce
  //socket.write("Welcome " + socket.name + "\n");
  //broadcast(socket.name + " joined the chat\n", socket);

  // Handle incoming messages from clients.
  socket.on('data', function (data) {
    //broadcast(socket.name + "> " + data, socket);
  });

  // Remove the client from the list when it leaves
  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    //broadcast(socket.name + " left the chat.\n");
  });
  

}).listen(1337);

  // Send a message to all clients
  function broadcast(message, sender) {
    clients.forEach(function (client) {
      // Don't want to send it to sender
      if (client === sender) return;
      client.write(message);
    });
    // Log it to the server output too
    process.stdout.write(message)
}

console.log("Chat server running at port 1337\n");
var playing = false;
var sounds = {
	  kitsch: ["huja", "laughter", "scream", "tata", "circus"]
	, kunst: ["huja", "laughter", "scream", "tata", "circus"]
}
var soundnrs = {
	  kunst: 0
	, kitsch: 0
}

function readButtons() {
	var child = exec("/usr/bin/sudo /bin/bash /home/pi/keyboard.sh", function (error, stdout, stderr) {
		if (error) return;
		if (stdout.length  === 0) return;
		if (stdout) broadcast("" + stdout);

		if (playing) return;

		var cmd = "/usr/bin/aplay /home/pi/kitschometer/exposition_raspberry/";

		if (stdout.substr(0,2) == "64") {
			playing =  true;
			var sound = cmd + sounds.kunst[soundnrs.kunst]  + ".wav";
			soundnrs.kunst = (soundnrs.kunst + 1) % sounds.kunst.length;
			soundnrs.kitsch = (soundnrs.kitsch + 1) % sounds.kitsch.length;

			var child_sound = exec(sound, function (error, stdout, stderr) {
				playing =  false;
			});
		} else if (stdout.substr(0,3) == "128") {
			playing =  true;
			var sound = cmd + sounds.kitsch[soundnrs.kitsch]  + ".wav";

			soundnrs.kitsch = (soundnrs.kitsch + 1) % sounds.kitsch.length;
			soundnrs.kunst = (soundnrs.kunst + 1) % sounds.kunst.length;

			var child_sound = exec(sound, function (error, stdout, stderr) {
				playing =  false;
			});
		}


	});
}
setInterval(function() {readButtons()}, 500);




