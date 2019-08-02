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
        console.log(`${roleid} on ${serverid}`);
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
    resolveProposal(proposal) {
        const server = proposal.server;
        const promises = proposal.actions.map((action) => {
            switch (action.code) {
                case 1000:
                case 1001:
                    return this.resolveUser(action.p0)
                    .then((user) => {
                        return {
                            code: action.code,
                            p0: user,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2000:
                    return Promise.resolve(action);
                case 2001:
                case 2002:
                    return Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveRolePermission(action.p1),
                    ])
                    .then(([role, permission]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: permission,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2003:
                case 2004:
                    return Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveRoleSetting(action.p1),
                    ])
                    .then(([role, setting]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: setting,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2005:
                    return this.resolveRole(action.p0, server)
                    .then((role) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2006:
                    return this.resolveRole(action.p0, server)
                    .then((role) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2007:
                case 2008:
                    return Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveUser(action.p1),
                    ])
                    .then(([role, user]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: user,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3000:
                    return Promise.resolve(action);
                case 3001:
                    return this.resolveChannel(action.p0, server)
                    .then((channel) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3002:
                case 3003:
                case 3004:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveRole(action.p1, server),
                        this.resolveChannelPermission(action.p2),
                    ])
                    .then(([channel, role, permission]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: role,
                            p2: permission,
                            position: action.position,
                        };
                    });
                case 3005:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveRole(action.p1, server),
                    ])
                    .then(([channel, role]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: role,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3006:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveRole(action.p1, server),
                    ])
                    .then(([channel, role]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: role,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3007:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveChannelSetting(action.p1),
                    ])
                    .then(([channel, setting]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: setting,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 4000:
                    return this.resolveServerSetting(action.p0)
                    .then((setting) => {
                        return {
                            code: action.code,
                            p0: setting,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
            }
        });
        return Promise.all(promises)
        .then((newActions) => {
            proposal.actions = newActions;
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
    resolveActions(actions, server) {
        const resolvedActions = actions.map((action) => {
            switch (action.code) {
                case 1000:
                case 1001:
                    return this.resolveUser(action.p0)
                    .then((user) => {
                        return {
                            code: action.code,
                            p0: user,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2000:
                    return Promise.resolve(action);
                case 2001:
                case 2002:
                    return Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveRolePermission(action.p1),
                    ])
                    .then(([role, permission]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: permission,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2003:
                case 2004:
                    return Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveRoleSetting(action.p1),
                    ])
                    .then(([role, setting]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: setting,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2005:
                    return this.resolveRole(action.p0, server)
                    .then((role) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2006:
                    return this.resolveRole(action.p0, server)
                    .then((role) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 2007:
                case 2008:
                    return Promise.all([
                        this.resolveRole(action.p0, server),
                        this.resolveUser(action.p1),
                    ])
                    .then(([role, user]) => {
                        return {
                            code: action.code,
                            p0: role,
                            p1: user,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3000:
                    return Promise.resolve(action);
                case 3001:
                    return this.resolveChannel(action.p0, server)
                    .then((channel) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3002:
                case 3003:
                case 3004:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveRole(action.p1, server),
                        this.resolveChannelPermission(action.p2),
                    ])
                    .then(([channel, role, permission]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: role,
                            p2: permission,
                            position: action.position,
                        };
                    });
                case 3005:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveRole(action.p1, server),
                    ])
                    .then(([channel, role]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: role,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3006:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveRole(action.p1, server),
                    ])
                    .then(([channel, role]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: role,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 3007:
                    return Promise.all([
                        this.resolveChannel(action.p0, server),
                        this.resolveChannelSetting(action.p1),
                    ])
                    .then(([channel, setting]) => {
                        return {
                            code: action.code,
                            p0: channel,
                            p1: setting,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
                case 4000:
                    return this.resolveServerSetting(action.p0)
                    .then((setting) => {
                        return {
                            code: action.code,
                            p0: setting,
                            p1: action.p1,
                            p2: action.p2,
                            position: action.position,
                        };
                    });
            }
        });
        return Promise.all(resolvedActions)
        .catch((e) => {
            throw {
                type: 'internal',
                stage: 'actionResolution',
                message: 'Internal error',
                http_status: 500,
                previous: e,
            };
        });
    },
};