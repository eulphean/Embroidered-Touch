// Author: Amay Kataria
// Date: 06/16/2021
// File: central.js
// Description: Core centra web-server, which is responsible to ensure inter-connectivity between multiple 
// web-apps. This will talk to the web-apps using websockets. 

var express = require('express'); 
var socket = require('socket.io');
var cors = require('cors');
var Pool = require('pg').Pool; 

// ------------------ postgresql database ---------------------- // 
const connString = process.env['DATABASE_URL'];
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

// ------------------ Express webserver ------------------------ //
var app = express(); 
app.use(cors());
// Client index.html to be read. 
app.use(express.static('./Client')); 
var server = require('http').createServer(app); 
// ------------------ Websocket ------------------------ //
var io = socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
        credentials: true
    }
}); 

server.listen(process.env.PORT || 5000, function() {
    console.log('Central server successfully started'); 
});

// /app and /central are two seperate namespaces. 
var appSocket = io.of('/app').on('connection', onWebClient); // Connects all web instance to this. 
var centralClientSocket = io.of('/central').on('connection', onCentralClient); // Connects the web instance of central server to read data. 

// Send an event to all connected clients to keep the Socket Connection Alive. 
// This event is sent every 1 second to every client connected. 
setInterval(alive, 1000);

function alive() {
    var t = new Date().toTimeString(); 
    appSocket.emit('time', t); 
    centralClientSocket.emit('time', t); 
}

function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 
    // Register for an event. 
    socket.on('broadcast', onUpdateBroadcast);
    socket.on('sensorData', handleSensorData);
    // socket.on('writePayload', onTextPayload); 
    socket.on('disconnect', () => console.log('Web client ' + socket.id + ' disconnected')); 
}

// Rooms are automatically cleared when the client gets disconnected. 
var broadcastClients = []; 
var roomName = 'fabric';
function onUpdateBroadcast() {
    console.log('Update broadcast hit.');
    var socket = this; 

    // NOTE: MAYBE BLOCK the third user to join this room. 
    // How will the third user join the room? 

    // Returns a set of members in the room already.
    var members = io.of('/app').adapter.rooms.get(roomName);
    if (members === undefined) {
        // Room doesn't exist at all, so add the socket. 
        socket.join(roomName);

        // NOTE: Maybe send an event back saying two users are
        // already in a room or something.
        console.log('Socket added to the room.');
    } else if (members.has(socket.id)) {
        socket.leave(roomName);
        console.log('Socket left the room.');
    } else {
        socket.join(roomName);
        console.log('Socket added to the room.');
    }
    
    // Print a room summary. 
    console.log(io.of('/app').adapter.rooms.get(roomName));

    // Am I already broadcasting? 
    // If I am, stop broadcasting me. 
    // Else, update my broadcast status. 

    // Every client connected should have a broadcast status. 
    // It should be a map of socket id, with broadcast status. 

    // When the transmit text starts happening, we first check if the client is actually in the broadcast mode 
    // or not. 
}

function handleSensorData(data) {
    var socket = this; 
    // if it's here, it's already in the room. 
    // Don't check again, just emit data to everybody in the room. 
    socket.to(roomName).emit('receiveSensorData', data);

    console.log('Emiting data');
}

function onCentralClient(socket) {
    console.log('New Central Web Client connection: ' + socket.id); 
    // Register for an event. 
    // socket.on('writePayload', onTextPayload); 
    socket.on('disconnect', () => console.log('Central Web client ' + socket.id + ' diconnected'));
}