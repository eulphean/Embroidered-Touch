// Name: Websocket.js
// Author: Amay Kataria.
// Date: 06/15/2021
// Description: Class responsible for communication with the webserver. We use websockets
// technology for this. Here we have the websocket client, which communicates with backend
// server over websockets.

import io  from 'socket.io-client'

const localhostURL = "http://localhost:5000";
// const herokuURL = "https://fabric-backend.herokuapp.com";

class Websocket {
    constructor() {
        this.siteURL = localhostURL + '/app'; 
        this.loginURL = localhostURL + '/login';
        this.signupURL = localhostURL + '/signup';

        this.socket = io(this.siteURL, {
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionAttempts: Infinity
        });

        this.socket.once('connect', this.subscribe.bind(this));
        this.canBroadcast = false; 

        // ------------ Callbacks fired on response from sockets ------------------------ //
        this.sensorDataCallback = ''; // Fired when the client receives data from the sensors.
        this.roomDataCallback = ''; // Fired when the client receives data about the room. 
    }

    subscribe() {
        console.log('Connected');

        // Subscribe to incoming events from the webserver here. 
        this.socket.on('time', this.logTime.bind(this));
        this.socket.on('receiveSensorData', this.handleSensorData.bind(this));
        this.socket.on('receiveRoomUpdate', this.handleRoomUpdate.bind(this)); 
    }

    // ----------------------- SENSOR DATA BROADCAST--------------------- //
    joinRoom(roomDataCbk, sensorDataCbk) {
        this.socket.emit('room');
        this.canBroadcast = true; 
        this.sensorDataCallback = sensorDataCbk; 
        this.roomDataCallback = roomDataCbk; 
    }

    leaveRoom() {
        this.socket.emit('room');
        this.canBroadcast = false; 
    }

    handleRoomUpdate(data) {
        this.roomDataCallback(data); 
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

    // -------------------- DON'T CHANGE THESE -------------------    
    disconnect() {
        console.log('Socket Server Disconnected.');
    }

    logTime(data) {
        //console.log('Socket Connection Alive: ' + data);
    }

}

// New keyword calls the constructor for the component.
export default new Websocket();