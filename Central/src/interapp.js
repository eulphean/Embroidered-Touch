// Author: Amay Kataria
// Date: 06/17/2021
// File: interapp.js
// Description: Helper module to handle all interapp communication of sensor data. This
// module is invoked from sockets module. 

var socket = require('socket.io');

let roomName = 'fabric';
module.exports = {
    broadcastSensorData: function(socket, data) {
        // if it's here, it's already in the room. 
        // Don't check again, just emit data to everybody in the room. 
        socket.to(roomName).emit('receiveSensorData', data);
        console.log('Emiting data');
    },

    updateRoom: function(io, socket) {
        console.log('Update broadcast hit.');
        // NOTE: MAYBE BLOCK the third user to join this room. 
        // How will the third user join the room? 
    
        // Returns a set of members in the room already.
        var members = io.of('/app').adapter.rooms.get(roomName);
        if (members === undefined) {
            // Room doesn't exist at all, so add the socket. 
            socket.join(roomName);
    
            // NOTE: Maybe send an event back saying two users are
            // already in a room or something.
            console.log('Socket added to the room.');
        } else if (members.has(socket.id)) {
            socket.leave(roomName);
            console.log('Socket left the room.');
        } else {
            socket.join(roomName);
            console.log('Socket added to the room.');
        }
        
        // Print a room summary. 
        console.log(io.of('/app').adapter.rooms.get(roomName));
    }
}