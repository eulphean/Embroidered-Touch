// Author: Amay Kataria
// Date: 06/17/2021
// File: database.js
// Description: Helper module to handle all database related methods. This module is responsible
// to read, load, commit from the database. It's invoked from the sockets module. 

var Pool = require('pg').Pool;

// ------------------ postgresql database ---------------------- // 
//const connString = process.env['DATABASE_URL'];
const connString = 'postgresql://localhost/fabric_instrument?user=amaykataria&password=abc123';
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

    queryUser: function(username, password, res) {
        onQueryUserTable(username, password, res);
    },

    createUser: function(username, password, configs, res) {
        onCreateEntryUserTable(username, password, configs, res);
    }
}


function onWriteDatabase(data, socket) {
    let name = data['name'];
    let config = data['config'];
 
    // var queryText = 'INSERT INTO configs (name, s1, s2, s3) VALUES (${name}, ${s1}, ${s2}, ${s3})';
    // console.log(queryText);
    pool.query('INSERT INTO configs (name, config) VALUES ($1, $2)', [name, config], (error, result) => {
        if (error) {
            throw error;
        }

        console.log('Success: New entry in the database.');
    });
}

function onUpdateDatabase(data, socket) {
    let name = data['name'];
    let config = data['config'];

    console.log(data);

    pool.query('UPDATE configs SET config=$1 WHERE name=$2', [config, name], (error, result) => {
        if (error) {
            throw error;
        }

        console.log('Success: Updated entry in the database.');        
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

// This is a join command. It will return password and configs together. 
function onQueryUserTable(username, password, res) {
    console.log('create user');
    pool.query('SELECT users.password, configs.config FROM users, configs WHERE users.name=$1 AND configs.name=$1', [username], (error, result) => {
        if (error) {
            throw error;
        }

        let pass, configs = []; 
        if (result.rows.length > 0) {
            let user = result.rows[0];
            pass = user.password;
            configs[0] = user.config;
        }
        
        res.setHeader('Content-Type', 'application/json');
        if (password === pass) {
            pool.query('SELECT childa.config FROM childa WHERE childa.name=$1', [username], (error, result) => {
                if (error) {
                    throw error; 
                }

                // Extract config from childa. 
                let user = result.rows[0];
                configs[1] = user.config; 
                
                pool.query('SELECT childb.config FROM childb WHERE childb.name=$1', [username], (error, result) => {
                    let user = result.rows[0]; 
                    configs[2] = user.config; 

                    res.end(JSON.stringify({ result: 'user_found', configs: configs }));
                    console.log('User found.');
                }); 
            });
        } else {
            res.end(JSON.stringify({ result: 'user_not_found' }));
            console.log('User not found.');
        }
    });
}

function onCreateEntryUserTable(username, password, configs, res) {
    let sweaterConfig = configs[0];
    let childAConfig = configs[1]; 
    let childBConfig = configs[2]; 

    pool.query('SELECT * FROM users WHERE name=$1', [username], (error, result) => {
        if (error) {
            throw error; 
        }

        res.setHeader('Content-Type', 'application/json');
        if (result.rows.length > 0) {
            res.end(JSON.stringify({ result: 'user_exists'}));
            console.log('User Exists');
        } else {
            pool.query('INSERT INTO users (name, password) VALUES ($1, $2)', [username, password], (error, result) => {
                if (error) {
                    throw error;
                }

                // sweater config. 
                pool.query('INSERT INTO configs (name, config) VALUES ($1, $2)', [username, sweaterConfig], (error, result) => {
                    if (error) {
                        throw error; 
                    }

                    // childA config.
                    pool.query('INSERT INTO childa (name, config) VALUES ($1, $2)', [username, childAConfig], (error, result) => {
                        if (error) {
                            throw error;
                        }

                        // childB config.
                        pool.query('INSERT INTO childb (name, config) VALUES ($1, $2)', [username, childBConfig], (error, result) => {    
                            if (error) {
                                throw error; 
                            }    

                            // Resolve the request.
                            res.end(JSON.stringify({ result: 'new_user'}));
                            console.log('New User created.');
                        });
                    });
                });
            })
        }
    });
}