// Served through nodejs. It should show a table of all the entries that are 
// created on the Encryption-Archive website. 
var socket; 
var table;

var localhostURL = "http://localhost:5000/central"
var herokuURL = "";

function setup() {
  socket = io(herokuURL, { 
    reconnection: true,
    reconnectionDelay: 500, 
    reconnectionAttempts: Infinity
  }); 

  socket.once('connect', onConnected);
}

function logTime(time) {
  console.log('Socket Connection Alive: ' + time); 
}

function onConnected() {
  console.log('Socket ' + socket.id + ' Connected');

  // Subsribe to other events. 
  socket.on('showEntries', showEntries); 
  socket.on('deleteSuccess', onEntries); // Requery all the entries. 
  socket.on('time', logTime); 
  socket.on('disconnect', () => console.log('Socket Server Disconnected')); 
}