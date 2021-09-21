// Author: Amay Kataria
// Date: 06/17/2021
// File: interapp.js
// Description: Helper module to handle all interapp communication of sensor data. This
// module is invoked from sockets module. 
let adultRoom = 'fabric';
let childRoom = 'child'; 
module.exports = {
    broadcastSensorData: function(socket, data) {
        let msg = data['msg'];
        let product = data['product']; 
        let curRoom = product === 'adult' ? adultRoom : childRoom; 

        // if it's here, it's already in the room. 
        // Don't check again, just emit data to everybody in the room except itself. 
        socket.to(curRoom).emit('receiveSensorData', msg);
    },

    // User messages (figure out first). 
    updateRoom: function(io, socket, data) {
        console.log('Update Room.');
        // NOTE: MAYBE BLOCK the third user to join this room. 
        // How will the third user join the room? 
        let curRoom = data['product'] === 'adult ' ? adultRoom : childRoom; 
        console.log('Current Room: ' + curRoom);
    
        // Returns a set of members in the room already.
        var members = io.of('/app').adapter.rooms.get(curRoom);
        if (members === undefined) {
            // Room doesn't exist at all, so add the socket. 
            socket.join(curRoom);
            socket.emit('receiveRoomUpdate', 'userJoined');
            console.log('Socket added to the room.');
        } else if (members.has(socket.id)) {
            socket.to(curRoom).emit('receiveRoomUpdate', 'userLeft'); 
            socket.leave(curRoom);
            console.log('Socket left the room.');
        } else {
            // Room is complete. 
            // Socket that has joined needs to know and everybody else needs to know. 
            socket.emit('receiveRoomUpdate', 'roomComplete'); 
            socket.to(curRoom).emit('receiveRoomUpdate', 'roomComplete');  
            socket.join(curRoom);
            console.log('Socket added to the room.');
        }
        
        // Print a room summary. 
        console.log(io.of('/app').adapter.rooms.get(curRoom));
    }
}