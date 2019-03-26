const { discordUser } = require('../discord-interface');

module.exports = function(user, request) {
    return discordUser.getBoundaryData(request.currentUser.id)
    .then((boundaries) => {
        if(boundaries.user_ids.includes(user.id)) {
            return user;
        }
        else {
            throw {
                type: 'internal',
                stage: 'user',
                message: 'Boundary check failed',
                http_status: 401,
                previous: null,
            };
        }
    })
    .catch((e) => {
        throw {
            type: 'internal',
            stage: 'user',
            message: 'Error checking boundary',
            http_status: e.http_status,
            previous: null,
        };
    });
};