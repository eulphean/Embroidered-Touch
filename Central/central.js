// Author: Amay Kataria
// Date: 04/16/2020
// File: central.js
// Description: Core Central server implementation for mumimsafe.live. It serves 2 routes primarily. 
// Route 1 = client -> central -> printer
// Route 2 = streamer -> central -> client
// It will also have a public side, which I can use to see all the messages of the database and debug the incoming video stream. 

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

var appSocket = io.of('/app').on('connection', onWebClient); // Connects all web instance to this. 
var receiptSocket = io.of('/receipt').on('connection', onReceiptClient); // Connects receipt server to this. 
var centralClientSocket = io.of('/central').on('connection', onCentralClient); // Connects the web instance of central server to read data. 

// Send an event to all connected clients to keep the Socket Connection Alive. 
// This event is sent every 1 second to every client connected. 
setInterval(alive, 1000);

function alive() {
    var t = new Date().toTimeString(); 
    appSocket.emit('time', t); 
    receiptSocket.emit('time', t);
    centralClientSocket.emit('time', t); 
}

function onWebClient(socket) {
    console.log('New Web Client connection: ' + socket.id); 
    // For every incoming message payload from main web client application. 
    socket.on('writePayload', onTextPayload); 
    socket.on('readRandomEntries', () => {
        onReadRandomEntries(socket);
    });
    socket.on('readDatabase', ({ order }) => {
        onReadDatabase(order, socket); 
    }); 

    socket.on('disconnect', () => console.log('Web client ' + socket.id + ' disconnected')); 
}

function onReceiptClient(socket) {
    console.log('Receipt client connection: ' + socket.id);
    socket.on('disconnect', () => console.log('Receipt client ' + socket.id + ' disconnected'));
}

function onCentralClient(socket) {
    console.log('New Central Web Client connection: ' + socket.id); 
    socket.on('readEntries', onReadEntries); 
    socket.on('deleteTestEntries', onDeleteTestEntries)
    socket.on('disconnect', () => console.log('Central Web client ' + socket.id + ' diconnected'));
}

function onReadDatabase(order, socket) {
    console.log('Requesting for some random entries with order ' + order);
    var queryText = 'SELECT * FROM entries ORDER BY date ' + order + ', time ' + order + ';'; 
    pool.query(queryText, (error, results) => {
        sqlReadDatabaseCallback(error, results, socket)
    });
}

function sqlReadDatabaseCallback(error, results, socket) {
    if (error) {
        throw error;
    }
    
    // Format the results somehow. 
    var entries = results.rows; 

    console.log('Sending entire database entries: ' + entries.length);
    socket.emit('receiveDatabaseEntries', entries);
}

function onReadRandomEntries(socket) {
    console.log('Requesting for some random entries.');
    var queryText = 'SELECT * FROM entries ORDER BY random() limit 12;'; 
    pool.query(queryText, (error, results) => {
        sqlReadRandomCallback(error, results, socket)
    });
}

function sqlReadRandomCallback(error, results, socket) {
    if (error) {
        throw error;
    }
    
    // Format the results somehow. 
    var entries = results.rows; 

    console.log('Sending random entries');
    socket.emit('receiveRandomEntries', entries);
}

// ------------------ Handle incoming text payload ------------------------ //

function onTextPayload(payload) {
    console.log('New Write Payload Received.');
    
    // Store this payload into the database. 
    // Setup database first or this will error out badly. 
    storePayloadToDb(payload); 

    console.log('Emitting Print Payload');
    
    // Emit this payload to be printed on the receipt printer. 
    receiptSocket.emit('printPayload', payload); 
    // Also send this payload back to the website, so the printer can
    // print this message. 
    appSocket.emit('printPayload', payload);
}

// Store the entries into the database. 
function storePayloadToDb(payload) {
    const date = payload.date; 
    const time = payload.time; 
    const msg = payload.message; 

    // Write the payload to the database. 
    pool.query('INSERT INTO entries (date, time, message) VALUES ($1, $2, $3)', [date, time, msg], (error, result) => {
        if (error) {
            throw error; 
        }

        console.log('Success: New entry in the databse with message ' + msg); 
    }); 
}

// Delete all the test messages from the data base. 
function onDeleteTestEntries() {
    var queryText = "DELETE FROM entries WHERE message LIKE '%test%'"; 
    pool.query(queryText, onDeletionComplete); 
}

function onDeletionComplete(error, results) {
    if (error) {
        throw error;
    }
    
    console.log('Deletion Succesful'); 
    centralClientSocket.emit('deleteSuccess');
}

// THIS FUNCTION WILL NEED TO BE REWRITTEN. 
function onReadEntries(data) {
    console.log('Request to Read entries from ' + data.from + ' to ' + data.to);

    // Chose the callback to send the results back. 
    var sqlQueryCallback;
    if (data.state == 'show') {
        sqlQueryCallback = showEntriesCallback;
    }
    
    // Creating the query
    var queryText = ''; 
    if (data.from && data.to) {
        queryText = 'SELECT * FROM entries WHERE date >= $1 AND date <= $2 ORDER BY date ASC';
        pool.query(queryText, [data.from, data.to], sqlQueryCallback); 
    } else if (data.from && !data.to) {
        queryText = 'SELECT * FROM entries WHERE date >= $1 ORDER BY date ASC'; 
        pool.query(queryText, [data.from], sqlQueryCallback); 
    } else if (data.to && !data.from) {
        queryText = 'SELECT * FROM entries WHERE date <= $1 ORDER BY date ASC'; 
        pool.query(queryText, [data.to], sqlQueryCallback); 
    } else {
        var order = 'ASC';
        queryText = 'SELECT * FROM entries ORDER BY date ' + order + ', time ' + order + ';';
        pool.query(queryText, sqlQueryCallback); 
    }
}

function showEntriesCallback(error, results) {
    if (error) {
        throw error; 
    }
    centralClientSocket.emit('showEntries', results.rows); 
}
