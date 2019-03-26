const api = require('./api');

module.exports = {
    getServer(id) {
        return api.gateway.request({
            url: `/servers/${id}`,
        }).then((result) => {
            const d = result.data;
            let icon_hash;
            if(!d.icon) {
                icon_hash = null;
            }
            else {
                icon_hash = /icons\/\d+\/([\d\w]+)\./g.exec(d.icon)[1];
            }
            return {
                id: d.id,
                name: d.name,
                icon_hash: icon_hash,
            };
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
                    message: 'Server not found or unavailable',
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
                    previous: e.data,
                };
            }
            if(e.response.status == 500) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Gateway error while fetching server',
                    http_status: 500,
                    previous: e.data,
                };
            }
        });
    },
    getUsers(id) {
        return api.gateway.request({
            url: `/servers/${id}/members`,
        }).then((result) => {
            const d = result.data;
            return d.map((user) => {
                let avatar_hash;
                if(!user.avatar) {
                    avatar_hash = null;
                }
                else {
                    avatar_hash = /avatars\/\d+\/([\d\w]+)\./g.exec(user.avatar)[1];
                }
                return {
                    id: user.id,
                    name: `${user.username}#${user.discriminator}`,
                    avatar_hash: avatar_hash,
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
                    message: 'Server not found or unavailable',
                    http_status: e.response.status,
                    previous: e.data,
                };
            }
            if(e.response.status == 401) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Malformed input',
                    http_status: e.response.status,
                    previous: e.data,
                };
            }
            if(e.response.status == 500) {
                throw {
                    type: 'axios',
                    stage: 'server',
                    message: 'Gateway error while fetching members',
                    http_status: 500,
                    previous: e.data,
                };
            }
        });
    },
};