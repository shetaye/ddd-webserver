const api = require('./api');

module.exports = {
    getUser(id) {
        return api.gateway.request({
            url: `/users/${id}`,
        }).then((result) => {
            const d = result.data;
            let avatar_hash;
            if(!d.avatar) {
                avatar_hash = null;
            }
            else {
                avatar_hash = /avatars\/\d+\/([\d\w]+)\./g.exec(d.avatar)[1];
            }
            return {
                id: d.id,
                name: `${d.username}#${d.discriminator}`,
                avatar_hash: avatar_hash,
            };
        })
        //TODO: Add catch that creates standard error object and throws it
        .catch((e) => {
            /* Must be axios (directly calling axios) */
            if(!e.response) {
                throw {
                    type: 'axios',
                    stage: 'user',
                    message: 'Error while calling endpoint',
                    http_status: 500,
                    previous: null,
                };
            }
            if(e.response.status == 404) {
                throw {
                    type: 'axios',
                    stage: 'user',
                    message: 'User not found',
                    http_status: e.response.status,
                    previous: e.response.data,
                };
            }
            if(e.response.status == 401) {
                throw {
                    type: 'axios',
                    stage: 'user',
                    message: 'Malformed input',
                    http_status: e.response.status,
                    previous: e.response.data,
                };
            }
            if(e.response.status == 500) {
                throw {
                    type: 'axios',
                    stage: 'user',
                    message: 'Gateway error while fetching user',
                    http_status: 500,
                    previous: e.response.data,
                };
            }
        });
    },
    getServers(id) {
        return api.gateway.request({
            url: `/users/${id}/servers`,
        }).then((result) => {
            const d = result.data;
            return d.map((server) => {
                let icon_hash;
                if(!server.icon) {
                    icon_hash = null;
                }
                else {
                    icon_hash = /icons\/\d+\/([\d\w]+)\./g.exec(server.icon)[1];
                }
                return {
                    id: server.id,
                    name: server.name,
                    icon_hash: icon_hash,
                };
            });
        })
        //TODO: Add catch that creates standard error object and throws it
        .catch((e) => {
            /* Must be axios (directly calling axios) */
            if(!e.response) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Error while calling endpoint',
                    http_status: 500,
                    previous: null,
                };
            }
            if(e.response.status == 404) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'User not found',
                    http_status: e.response.status,
                    previous:e.response.data,
                };
            }
            if(e.response.status == 401) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Malformed input',
                    http_status: e.response.status,
                    previous: e.response.data,
                };
            }
            if(e.response.status == 500) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Gateway error while fetching user',
                    http_status: 500,
                    previous: e.response.data,
                };
            }
        });
    },
    getCurrentUser(token) {
        return api.discord.request({
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            url: '/users/@me',
        })
        .then((result) => {
            return {
                id: result.data.id,
                name: `${result.data.username}#${result.data.discriminator}`,
                avatar_hash: result.data.avatar,
            };
        })
        //TODO: Add catch that creates standard error object and throws it
        .catch((e) => {
            if(e.response) {
                throw {
                    type: 'discord',
                    stage: 'auth',
                    message: 'Malformed input',
                    http_status: 401,
                    previous: e.response.data,
                };
            }
            else{
                throw {
                    type: 'discord',
                    stage: 'auth',
                    message: 'Internal discord error while authenticating',
                    http_status: 500,
                    previous: null,
                };
            }
        });
    },
    /*
    {
        user_id: <id>,
        server_ids: [<id>],
        user_ids: [<id>],
    }
    */
    getBoundaryData(id) {
        return api.gateway.request({
            url: `/users/${id}/boundaries`,
        })
        .then((result) => {
            return result.data;
        })
        .catch((e) => {
            /* Must be axios (directly calling axios) */
            if(!e.response) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Error while calling endpoint',
                    http_status: 500,
                    previous: null,
                };
            }
            if(e.response.status == 404) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'User not found',
                    http_status: e.response.status,
                    previous: e.response.data,
                };
            }
            if(e.response.status == 401) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Malformed input',
                    http_status: e.response.status,
                    previous: e.response.data,
                };
            }
            if(e.response.status == 500) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Gateway error while fetching user',
                    http_status: 500,
                    previous: e.response.data,
                };
            }
        });
    },
};