const proposal = require('./proposal');
const user = require('./user');
const server = require('./server');
const db = require('./db');

/*
Abstractions for the Database.
These functions are responsible for querying the SQL server and
generating an object that is in accordance with the API
*/

module.exports = {
    db,
    dbProposal: proposal,
    dbUser: user,
    dbServer: server,
};
