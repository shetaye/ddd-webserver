const api = require('./api');

module.exports = {
    getServer(id) {
        return api.gateway.request({
            url: `/servers/${id}`,
        });
    },
    getUsers(id) {
        return api.gateway.request({
            url: `/servers/${id}/members`,
        });
    },
};