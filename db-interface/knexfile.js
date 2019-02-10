const fs = require('fs');

const { user, pass, host, db } = JSON.parse(fs.readFileSync('../config.json')).db;

module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: host,
            user: user,
            password: pass,
            database: db,
        },
        seeds: {
            directory: './seeds/',
        },
    },
};