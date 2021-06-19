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

        // ------------ Callbacks fired on response from sockets ------------------------ //
        this.sensorDataCallback = ''; // Fired when the client receives data from the sensors.
        this.readAllConfigCallback = ''; // Fired when the client all configs from the database. 
    }

    subscribe() {
        console.log('Connected');

        // Subscribe to incoming events from the webserver here. 
        this.socket.on('time', this.logTime.bind(this));
        this.socket.on('receiveSensorData', this.handleSensorData.bind(this));
        this.socket.on('receiveAllConfigs', this.handleAllConfigs.bind(this));
    }

    // ----------------------- SENSOR DATA BROADCAST--------------------- //
    updateRoom(callback) {
        this.socket.emit('room');
        this.canBroadcast = !this.canBroadcast; 
        this.sensorDataCallback = callback; 
    }

    broadcastText(text) {
        if (this.canBroadcast) {
            this.socket.emit('sensorData', text); 
        }
    }

    // Fire the sensor data callback registered before. 
    handleSensorData(data) {
        this.sensorDataCallback(data);
    }

    // ----------------------- DATABASE CALLS --------------------- //
    saveUserConfig(payload) {
        this.socket.emit('saveUserConfig', payload); 
    }

    updateUserConfig(payload) {
        this.socket.emit('updateUserConfig', payload);
    }

    deleteUserConfig(configName) {
        this.socket.emit('deleteUserConfig', configName);
    }

    // ------------------ LOAD ALL USER CONFIGS ------------------
    requestForConfigs(callback) {
        this.readAllConfigCallback = callback;
        this.socket.emit('requestForConfigs');
    }

    // Fire the readAllConfigCallback registered before. 
    handleAllConfigs(data) {
        console.log('Handle all config: ' + data);
        this.readAllConfigCallback(data); 
    }

    // -------------------- DON'T CHANGE THESE -------------------    
    disconnect() {
        console.log('Socket Server Disconnected.');
    }

    logTime(data) {
        console.log('Socket Connection Alive: ' + data);
    }

}

// New keyword calls the constructor for the component.
export default new Websocket();