// Author: Amay Kataria
// Date: 06/17/2021
// File: database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database. It's invoked from the sockets module. 

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
const connString = process.env['DATABASE_URL'];
console.log('Database Connection String: ' + connString); 
const pool = new Pool({
    connectionString: connString
}); 

module.exports = {    
    // Operation: 0 (save data)
    // Operation: 1 (load data)
    // Operation: 2 (update data)
    handleUserConfig: function(data, operation) {
        var socket = this; 
        if (operation === 0) {
            onWriteDatabase(data, socket);
        } else if (operation === 1) {
            let configName = data['name'];
            console.log('Load data');
        } else if (operation === 2) {
            let configName = data['name'];
            console.log('Update data');
        }
    },
    
    readAllConfigs: function() {
        // Read configs, then emit an event with the results
        // back to the client. 
        // I should modularize database and app calls into their own
        // respective modules. 
    }
}


function onWriteDatabase(data, socket) {
    console.log('Writing data to the database.');
    let name = data['name'];
    let s1 = data['s1'];
    let s2 = data['s2'];
    let s3 = data['s3'];
    
    // Need to ensure that this cannot be same name. 
    // Will need to do a read first - if the key exists, then I call the UPDATE API. 

    // var queryText = 'INSERT INTO configs (name, s1, s2, s3) VALUES (${name}, ${s1}, ${s2}, ${s3})';
    // console.log(queryText);
    pool.query('INSERT INTO configs (name, s1, s2, s3) VALUES ($1, $2, $3, $4)', [name, s1, s2, s3], (error, result) => {
        if (error) {
            throw error;
        }

        console.log('Success: New entry in the database.');
        // sqlWriteDatabaseCallback(error, results, socket);
    });
}

function sqlWriteDatabaseCallback(error, results, socket) {
    if (error) {
        throw error;
    }
    
    // Format the results somehow. 
    var entries = results.rows; 

    // console.log('Sending entire database entries: ' + entries.length);
    socket.emit('receiveDatabaseEntries', entries);
}
