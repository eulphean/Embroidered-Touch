// Served through nodejs. It should show a table of all the entries that are 
// created on the Encryption-Archive website. 
var socket; 
var table;

//var localhostURL = "http://localhost:5000/central"
var herokuURL = "https://blooming-refuge-71111.herokuapp.com/central";

function setup(){
  table = document.getElementById('entries');
  table.width = displayWidth; // Change
  setupTableTitle(); 

  socket = io(herokuURL, { 
    reconnection: true,
    reconnectionDelay: 500, 
    reconnectionAttempts: Infinity
  }); 

  socket.once('connect', onConnected);
  
  var canvas = document.getElementById('video-canvas');
	var url = 'wss://' + 'radiant-oasis-49153.herokuapp.com/'; 
	var player = new JSMpeg.Player(url, {canvas: canvas});
}

function logTime(time) {
  console.log('Socket Connection Alive: ' + time); 
}

function onDeleteEntries() {
  socket.emit('deleteTestEntries'); 
}

function onEntries() {
  // Clear the table first. 
  clearTable(); 
  var data = getData('show'); 
  socket.emit('readEntries', data);
}

function getData(s) {
  var startDate = document.getElementById('start').value; 
  var endDate = document.getElementById('end').value; 

  var data = { 
    from: startDate, 
    to: endDate,
    state: s, // Determines what kind of callback to fire from the store. 
  }; 

  console.log('Browser payload: ' + data.erows); 

  return data; 
}

function onConnected() {
  console.log('Socket ' + socket.id + ' Connected');

  // Subsribe to other events. 
  socket.on('showEntries', showEntries); 
  socket.on('deleteSuccess', onEntries); // Requery all the entries. 
  socket.on('time', logTime); 
  socket.on('disconnect', () => console.log('Socket Server Disconnected')); 
}

function showEntries(entries) {
  console.log('Received Entries from the Store');
  var numEntries = document.getElementById('numentries');
  numEntries.innerHTML = entries.length; 

  // Take this payload and show it in the table
  for (var i in entries) {
    var row = table.insertRow(1); // Push on the top.  
    
    var dateCell = row.insertCell(0);
    // NOTE: This splitting logic is necessary to account for the format
    // in which date is retried from the SQL database. 
    var d = entries[i].date.toString().split("T"); 
    dateCell.innerHTML = d[0];
    
    var timeCell = row.insertCell(1); 
    timeCell.innerHTML = entries[i].time; 
    
    var keyCell = row.insertCell(2); 
    keyCell.innerHTML =  entries[i].message; 
  }
}

function clearTable() {
  var rowCount = table.rows.length;
  for (var x=rowCount-1; x>0; x--) {
    table.deleteRow(x);
  }
}

function setupTableTitle() {
  var row = table.insertRow(0);
 
  var dateCell = row.insertCell(0);
  dateCell.innerHTML = 'DATE (YYYY-MM-DD)';
  dateCell.width = '10%';

  var timeCell = row.insertCell(1);
  timeCell.innerHTML = 'TIME';
  timeCell.width = '8%';

  var binaryCell = row.insertCell(2);
  binaryCell.innerHTML = 'Message';
  binaryCell.width = '70%';
}