// Name: Websocket.js
// Author: Amay Kataria.
// Date: 06/15/2021
// Description: Class responsible for communication with the webserver. We use websockets
// technology for this. Here we have the websocket client, which communicates with backend
// server over websockets.

import io  from 'socket.io-client'
import ProductStore, { PRODUCT } from '../Stores/ProductStore';

const localhostURL = "http://localhost:5000";
//const herokuURL = "https://fabric-backend.herokuapp.com";

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
        let product = ProductStore.getProductName();
        let pData = product === PRODUCT.SWEATER ? 'adult' : 'child'; 
        let data = {'product': pData}; 

        this.socket.emit('room', data);
        this.canBroadcast = true; 
        this.sensorDataCallback = sensorDataCbk; 
        this.roomDataCallback = roomDataCbk; 
    }

    leaveRoom() {
        let product = ProductStore.getProductName();
        let pData = product === PRODUCT.SWEATER ? 'adult' : 'child'; 
        let data = {'product': pData}; 

        this.socket.emit('room', data);
        this.canBroadcast = false; 
    }

    handleRoomUpdate(data) {
        this.roomDataCallback(data); 
    }

    // Called from ConnectionMode
    broadcastAdultData(sensorNum, adsr, chipSide, lifeSignal) {
        let prod = ProductStore.getProductName();
        let pData = prod === PRODUCT.SWEATER ? 'adult' : 'child'; 
        let msg = sensorNum + '-' + adsr + '-' + chipSide + '-' + lifeSignal;
        let payload = {'product': pData, 'msg': msg};

        if (this.canBroadcast) {
            this.socket.emit('sensorData', payload); 
        }
    }

    // Called from ConnectionMode
    broadcastChildData(product, sensorIdx, adsr) {
        let prod = ProductStore.getProductName();
        let pData = prod === PRODUCT.SWEATER ? 'adult' : 'child'; 
        let msg = product + '-' + sensorIdx + '-' + adsr; 
        let payload = {'product': pData, 'msg': msg};

        if (this.canBroadcast) {
            this.socket.emit('sensorData', payload);
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