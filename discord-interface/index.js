const api = require('./api');
const server = require('./server');
const user = require('./user');

/*
Abstractions for the gateway API.
These functions are responsible for forwarding data to and from the discord gateway.
*/
module.exports = {
    api,
    discordServer: server,
    discordUser: user,
};