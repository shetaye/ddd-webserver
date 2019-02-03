const api = require('./api');
const server = require('./server');
const user = require('./user');

/* A possible better solution would be to instead return a function that accepts the token as a parameter instead of passing the token as a parameter to every call */
module.exports = {
    api,
    server,
    user,
};