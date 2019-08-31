const fs = require('fs');
const Firestore = require('@google-cloud/firestore');
const { user, pass, host, db, credentials_path } = JSON.parse(fs.readFileSync('config.json')).db;
const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: host,
        user: user,
        password: pass,
        database: db,
    },
});

const firestore = new Firestore({
    projectId: 'direct-discord-democracy',
    keyFilename: credentials_path,
});

module.exports = firestore;