// Author: Amay Kataria
// Date: 06/17/2021
// File: interapp.js
// Description: Helper module to handle all interapp communcation to pass sensor 
// data between multiple application instances. 

var socket = require('socket.io');
var database = require('./database.js');
const interapp = require('./interapp.js');

// Global variables. 
let appSocket, centralClientSocket; 
var io; 

module.exports = {
    socketConfig: function(server) {
        io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
                credentials: true
            }
        }); 

        // /app and /central are two seperate namespaces. 
        appSocket = io.of('/app').on('connection', onWebClient); // Connects all web instance to this. 
        centralClientSocket = io.of('/central').on('connection', onCentralClient); // Connects the web instance of central server to read data.         
    },

    // Send an event to all connected clients to keep the Socket Connection Alive. 
    // This event is sent every 1 second to every client connected. 
    pingAlive: function() {
        setInterval(ping, 1000);
    }
}

// Helper function. 
function ping() {
    var t = new Date().toTimeString(); 
    appSocket.emit('time', t); 
    centralClientSocket.emit('time', t); 
}

// Every web client connects through this code path and subscribes to other events. 
// All socket events are registered here. 
function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 

    // ------------------- Interapp communication -------------------- //
    socket.on('room', () => {
        interapp.updateRoom(io, socket); 
    });

    socket.on('sensorData', (data) => {
        interapp.broadcastSensorData(socket, data);
    });
    
    // ------------------- Database communication -------------------- //
    socket.on('saveUserConfig', (data) => {
        database.handleUserConfig(data, 0);
    });
    socket.on('updateUserConfig', (data) => {
        database.handleUserConfig(data, 1);
    });
    socket.on('deleteUserConfig', (data) => {
        database.handleUserConfig(data, 2);
    });
    
    socket.on('disconnect', () => console.log('Web client ' + socket.id + ' disconnected')); 
}

function onCentralClient(socket) {
    console.log('New Central Web Client connection: ' + socket.id); 
    // Register for an event. 
    // socket.on('writePayload', onTextPayload); 
    socket.on('disconnect', () => console.log('Central Web client ' + socket.id + ' diconnected'));
}
