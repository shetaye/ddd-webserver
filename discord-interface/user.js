const api = require('./api');

module.exports = {
    getUser(id) {
        return api.gateway.request({
            url: `/users/${id}`,
        });
    },
    getServers(id) {
        return api.gateway.request({
            url: `/users/${id}/servers`,
        });
    },
    getCurrentUser(token) {
        return api.discord.request({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            url: '/users/@me',
        });
    },
};