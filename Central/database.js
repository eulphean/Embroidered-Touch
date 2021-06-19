// Author: Amay Kataria
// Date: 06/17/2021
// File: database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database. It's invoked from the sockets module. 

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
const connString = process.env['DATABASE_URL'];
// const connString = 'postgresql://localhost/fabric_instrument?user=amaykataria&password=abc123';
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

module.exports = {    
    // Operation: 0 (save data)
    // Operation: 1 (update data)
    // Operation: 2 (delete data)
    handleUserConfig: function(data, operation) {
        var socket = this; 
        if (operation === 0) {
            console.log('Save data');
            onWriteDatabase(data, socket);
        } else if (operation === 1) {
            console.log('Update data');
            onUpdateDatabase(data, socket);
        } else if (operation === 2) {
            let configName = data;
            console.log('Delete data');
            onDeleteEntryFromDatabase(configName, socket);
        }
    },
    
    requestForConfigs: function(socket) {
        onReadAllEntriesDatabase(socket); 
    }
}


function onWriteDatabase(data, socket) {
    let name = data['name'];
    let s1 = Number(data['s1']);
    let s2 = Number(data['s2']);
    let s3 = Number(data['s3']);
 
    // var queryText = 'INSERT INTO configs (name, s1, s2, s3) VALUES (${name}, ${s1}, ${s2}, ${s3})';
    // console.log(queryText);
    pool.query('INSERT INTO configs (name, s1, s2, s3) VALUES ($1, $2, $3, $4)', [name, s1, s2, s3], (error, result) => {
        if (error) {
            throw error;
        }

        console.log('Success: New entry in the database.');
    });
}

function onUpdateDatabase(data, socket) {
    let name = data['name'];
    let s1 = Number(data['s1']);
    let s2 = Number(data['s2']);
    let s3 = Number(data['s3']);

    console.log(data);

    pool.query('UPDATE configs SET s1=$1, s2=$2, s3=$3 WHERE name=$4', [s1, s2, s3, name], (error, result) => {
        if (error) {
            throw error;
        }

        console.log('Success: Updated entry in the database.');        
    });
}

function onReadAllEntriesDatabase(socket) {
    pool.query('SELECT * FROM configs', (error, result) => {
        if (error) {
            throw error;
        }

        let data = result.rows; 
        // Emit all the data read. 
        socket.emit('receiveAllConfigs', data); 
        console.log('Success: All configs read.');
    });
}

function onDeleteEntryFromDatabase(configName, socket) {
    pool.query('DELETE FROM configs WHERE name=$1', [configName], (error, result) => {
        if (error) {
            throw error; 
        }

        console.log('Success: Deleted entry in the database.')
    });
}