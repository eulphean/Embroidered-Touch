// Author: Amay Kataria
// Date: 06/16/2021
// File: central.js
// Description: Core centra web-server, which is responsible to ensure inter-connectivity between multiple 
// web-apps. This will talk to the web-apps using websockets. 

var express = require('express'); 
var cors = require('cors');

var sockets = require('./sockets.js');
var database = require('./database.js');

// ------------------ Express webserver ---------------- //
var app = express(); 
app.use(cors());
app.use(express.static('./Client')); // Client index.html to be read. 
app.use(express.json());
var server = require('http').createServer(app); 

// ------------------ Websocket Configuration ------------ //
sockets.socketConfig(server); 

// ------------------ Express webserver ------------------------ //
server.listen(process.env.PORT || 5000, function() {
    console.log('Central server successfully started'); 
});

// Post request
app.post('/login', (req, res) => {
    let user = req.body.username;
    let password = req.body.password;
    database.queryUser(user, password, res);
});

app.post('/signup', (req, res) => {
    let user = req.body.username; 
    let password = req.body.password; 
    let configs = req.body.configs;
    database.createUser(user, password, configs, res); 
});

// Ping the main server. 
sockets.pingAlive();