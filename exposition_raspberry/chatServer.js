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

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 1337\n");

function readButtons() {
	var child = exec("/usr/bin/sudo /bin/bash /home/pi/kitschometer/exposition_raspberry/keyboard.sh", function (error, stdout, stderr) {
		//console.log(stderr);
		//console.log(error);
		if (error) return;
		//stdout += "";
		//stdout = stdout.replace(/\s*/g, ""); //.replace(/\r\n/g, "");

		if (stdout.length  === 0) return;

		//console.log("" + stdout);

		if (stdout) broadcast("" + stdout);

	});
}
setInterval(function() {readButtons()}, 500);




