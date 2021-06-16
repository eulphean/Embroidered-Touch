// Name: Websocket.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Class responsible for communication with the webserver. We use websockets
// technology for this. Here we have the websocket client, which communicates with backend
// server over websockets. 

import io  from 'socket.io-client'

const localhostURL = "http://localhost:5000/app";
const herokuURL = "https://blooming-refuge-71111.herokuapp.com/app";
const siteURL = localhostURL;

class Websocket {
    constructor() {
        // this.socket = io(siteURL, { 
        //     reconnection: true, 
        //     reconnectionDelay: 500, 
        //     reconnectionAttempts: Infinity
        // }); 

        // this.socket.once('connect', this.subscribe.bind(this)); 
        console.log(this.socket);
    }

    subscribe() {
        console.log('Connected');

        // Subscribe to events. 
        this.socket.on('time', this.logTime.bind(this)); 
        this.socket.on('disconnect', this.disconnect.bind(this));
        this.socket.on('receiveRandomEntries', this.receiveEntries.bind(this)); 
        this.socket.on('receiveDatabaseEntries', this.receiveDatabaseRentries.bind(this)); 
        this.socket.on('printPayload', this.printPayload.bind(this));
    }

    disconnect() {
        console.log('Socket Server Disconnected.')
    }

    logTime(data) {
        console.log('Socket Connection Alive: ' + data); 
    }

    // Send function and callback function. 
    requestData() {
       this.socket.emit('readRandomEntries'); 
    }


    receiveEntries(payload) {
        console.log('Entries received');
        this.props.processEntries(payload); 
    }

    // Send function and callback function. 
    readDatabase() {
        console.log('Request received');
        // Always read in descending order. 
        this.socket.emit('readDatabase', {order: 'DESC'}); 
    }

    receiveDatabaseRentries(payload) {
        console.log('Entries received');
        this.props.processDatabase(payload); 
    }

    printPayload(payload) {
        console.log('Payload received'); 
        if (this.props.appendDatabase) {
            this.props.appendDatabase(payload);
        }
    }
}

// New keyword calls the constructor for the component.
export default new Websocket(); 