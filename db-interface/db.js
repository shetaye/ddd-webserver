const fs = require('fs');
const { user, pass, host, db } = JSON.parse(fs.readFileSync('config.json')).db;
const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: host,
        user: user,
        password: pass,
        database: db,
    },
});

module.exports = knex;