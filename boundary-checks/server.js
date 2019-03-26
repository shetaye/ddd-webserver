const { discordUser } = require('../discord-interface');

module.exports = function(server, request) {
    return discordUser.getBoundaryData(request.currentUser.id)
    .then((boundaries) => {
        if(boundaries.server_ids.includes(server.id)) {
            return server;
        }
        else {
            throw {
                type: 'internal',
                stage: 'server',
                message: 'Boundary check failed',
                http_status: 401,
                previous: null,
            };
        }
    })
    .catch((e) => {
        throw {
            type: 'internal',
            stage: 'server',
            message: 'Error checking boundary',
            http_status: e.http_status,
            previous: e,
        };
    });
};