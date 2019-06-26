const discordServer = require('./server');
const discordUser = require('./user');

module.exports = {
    resolveUser(uid) {
        return discordUser.getUser(uid)
        .then((user) => {
            return user.name;
        })
        .catch((e) => {
            throw {
                type: 'resolution',
                stage: 'userResolution',
                message: 'User Resolution Error',
                http_status: 500,
                previous: e,
            };
        });
    },
    resolveRole(roleid, serverid) {
        return discordServer.getRoles(serverid)
        .then((roles) => {
            // Get the first role that matches the RoleID
            return roles.filter((role) => { return role.id == roleid; })[0].name;
        })
        .catch((e) => {
            throw {
                type: 'resolution',
                stage: 'roleResolution',
                message: 'Role Resolution Error',
                http_status: 500,
                previous: e,
            };
        });
    },
    resolveChannel(channelid, serverid) {
        return discordServer.getChannels(serverid)
        .then((channels) => {
            // Get the first channel that matches the ChannelID
            return channels.filter((channel) => { return channel.id == channelid; })[0].name;
        })
        .catch((e) => {
            throw {
                type: 'resolution',
                stage: 'channelResolution',
                message: 'Channel Resolution Error',
                http_status: 500,
                previous: e,
            };
        });
    },
    resolveRoleSetting(roleSetting) {
        return Promise.resolve(roleSetting);
    },
    resolveRolePermission(rolePermission) {
        return Promise.resolve(rolePermission);
    },
    resolveChannelSetting(channelSetting) {
        return Promise.resolve(channelSetting);
    },
    resolveChannelPermission(channelPermission) {
        return Promise.resolve(channelPermission);
    },
    resolveServerSetting(serverSetting) {
        return Promise.resolve(serverSetting);
    },
    resolveActions(proposal) {
        const unresolvedActions = proposal.actions;
        const resolvedActions = [];
        const server = proposal.server;
        for(let i = 0; i < unresolvedActions.length; i++) {
            const action = unresolvedActions[i];
            let promise;
            switch (action.code) {
                case 1000:
                case 1001:
                    promise = this.resolveUser(action.p0)
                    .then((user) => {
                        return {
                            code: action.code,
                            p0: user,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                    break;
                case 2000:
                    promise = Promise.resolve(action);
                    break;
                case 2001:
                    promise = Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveRolePermission(action.p1),
                    ])
                    .then(([role, permission]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: permission,
                            p2: action.p2,
                        };
                    });
                    break;
                case 2002:
                    promise = Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveRoleSetting(action.p1),
                    ])
                    .then(([role, setting]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: setting,
                            p2: action.p2,
                        };
                    });
                    break;
                case 2003:
                    promise = this.resolveRole(action.p0, server)
                    .then((role) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: action.p1,
                            p2: action.p2,
                        };
                    });
                    break;
                case 2004:
                case 2005:
                    promise = Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveUser(action.p1),
                    ])
                    .then(([role, user]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: user,
                            p2: action.p2,
                        };
                    });
                    break;
                case 3000:
                    promise = Promise.resolve(action);
                    break;
                case 3001:
                    promise = this.resolveChannel(action.p0, server)
                    .then((channel) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: action.p1,
                            p2: action.p2,
                        };
                    });
                    break;
                case 3002:
                    promise = Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveChannelPermission(action.p1),
                    ])
                    .then(([channel, permission]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: permission,
                            p2: action.p2,
                        };
                    });
                    break;
                case 3003:
                    promise = Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveChannelSetting(action.p1),
                    ])
                    .then(([channel, setting]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: setting,
                            p2: action.p2,
                        };
                    });
                    break;
                case 4000:
                    promise = this.resolveServerSetting(action.p0)
                    .then((setting) => {
                        return {
                            code: action.code,
                            p0: setting,
                            p1: action.p1,
                            p2: action.p2,
                        };
                    });
                    break;
            }
            resolvedActions.push(promise);
        }
        return Promise.all(resolvedActions)
        .then((completedPromises) => {
            proposal.actions = completedPromises;
            return proposal;
        })
        .catch((e) => {
            throw {
                type: 'internal',
                stage: 'proposalResolution',
                message: 'Internal error',
                http_status: 500,
                previous: e,
            };
        });
    },
};