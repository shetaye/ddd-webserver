const api = require('./api');
const server = require('./server');
const user = require('./user');
const resolver = require('./resolver');

/*
Abstractions for the gateway API.
These functions are responsible for forwarding data to and from the discord gateway.
*/
module.exports = {
    api,
    resolver,
    discordServer: server,
    discordUser: user,
};