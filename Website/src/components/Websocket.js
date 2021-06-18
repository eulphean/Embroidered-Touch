// Name: Websocket.js
// Author: Amay Kataria.
// Date: 06/15/2021
// Description: Class responsible for communication with the webserver. We use websockets
// technology for this. Here we have the websocket client, which communicates with backend
// server over websockets.

import io  from 'socket.io-client'

const localhostURL = "http://localhost:5000/app";
const herokuURL = "https://fabric-backend.herokuapp.com/app";
const siteURL = localhostURL;

class Websocket {
    constructor() {
        this.socket = io(siteURL, {
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: Infinity
        });

        this.socket.once('connect', this.subscribe.bind(this));
        this.canBroadcast = false; 
        this.dataCallback = ''; // Fired when the client receives data from the sensor.
    }

    subscribe() {
        console.log('Connected');

        // Subscribe to incoming events from the webserver here. 
        this.socket.on('time', this.logTime.bind(this));
        this.socket.on('receiveSensorData', this.handleSensorData.bind(this));
    }

    subscribeForUpdate(callback) {
        this.dataCallback = callback; 
    }

    disconnect() {
        console.log('Socket Server Disconnected.');
    }

    logTime(data) {
        console.log('Socket Connection Alive: ' + data);
    }

    // SHARE SHARE SHARE Data between users. // 
    updateBroadcast() {
        this.socket.emit('room');
        this.canBroadcast = !this.canBroadcast; 
    }

    broadcastText(text) {
        if (this.canBroadcast) {
            this.socket.emit('sensorData', text); 
        }
    }

    handleSensorData(data) {
        this.dataCallback(data);
    }

    // DATABASE CALL to save data.
    saveUserConfig(payload) {
        this.socket.emit('saveUserConfig', payload); 
    }

    loadUserConfig(payload, dataLoadedCallback) {
        this.socket.emit('loadUserConfig', payload);

        // Data loaded callback should be fired when we receive
        // data from the database. Subscribe to an event that 
        // can do that for us. 
    }
}

// New keyword calls the constructor for the component.
export default new Websocket();