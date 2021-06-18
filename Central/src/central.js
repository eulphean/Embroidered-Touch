// Author: Amay Kataria
// Date: 06/16/2021
// File: central.js
// Description: Core centra web-server, which is responsible to ensure inter-connectivity between multiple 
// web-apps. This will talk to the web-apps using websockets. 

var express = require('express'); 
var cors = require('cors');

var sockets = require('./sockets.js');

// ------------------ Express webserver ---------------- //
var app = express(); 
app.use(cors());
// Client index.html to be read. 
app.use(express.static('./Client')); 
var server = require('http').createServer(app); 

// ------------------ Websocket Configuration ------------ //
sockets.socketConfig(server); 

// ------------------ Express webserver ------------------------ //
server.listen(process.env.PORT || 5000, function() {
    console.log('Central server successfully started'); 
});

// Ping the main server. 
sockets.pingAlive();