const { discordUser } = require('../discord-interface');

module.exports = function(proposal, request) {
    return discordUser.getBoundaryData(request.currentUser.id)
    .then((boundaries) => {
        if(boundaries.server_ids.includes(proposal.server)) {
            return proposal;
        }
        else {
            throw {
                type: 'internal',
                stage: 'proposal',
                message: 'Boundary check failed',
                http_status: 401,
                previous: null,
            };
        }
    })
    .catch((e) => {
        throw {
            type: 'internal',
            stage: 'proposal',
            message: 'Error checking boundary',
            http_status: e.http_status,
            previous: e,
        };
    });
};