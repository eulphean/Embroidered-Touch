import React from 'react'
import Radium from 'radium'
import io  from 'socket.io-client'
import moment from 'moment-timezone'

//const localhostURL = "http://localhost:5000/app";
const herokuURL = "https://blooming-refuge-71111.herokuapp.com/app";
class Websocket extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            
        };

        this.socket = io(herokuURL, { 
            reconnection: true, 
            reconnectionDelay: 500, 
            reconnectionAttempts: Infinity
        }); 

        this.socket.once('connect', this.subscribe.bind(this)); 
    }

    // Return an empty div. 
    render() {
        return (null);
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

    sendMessage(message) {
        // Use the local time in Chicago as the point of reference. 
        var payload = {
          message: message.toLowerCase(), 
          date: moment.tz('America/Chicago').format('YYYY-MM-DD'),
          time: moment.tz('America/Chicago').format('h:mm:ss a')
        };
        
        // Send this payload to commit to the database. 
        console.log('Emitting Write Payload'); 
        this.socket.emit('writePayload', payload);
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

export default Radium(Websocket);