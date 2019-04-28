const express = require('express');
const router = express.Router();

const { discordServer } = require('../discord-interface');

const { checkSnowflake } = require('../utils');

const { dbServer } = require('../db-interface');

const { checkServer } = require('../boundary-checks');

router.get('/:id', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        //TODO: Standardize error object + wrap error object
        res.status(401).json({
            type: 'internal',
            stage: 'server',
            message: `Malformed ID ${req.params.id}`,
            http_status: 401,
            previous: null,
        });
        return;
    }
    discordServer.getServer(req.params.id)
    .then((server) => {
        /* Boundary check */
        return checkServer(server, req);
    })
    .then((server) => {
        res.status(200).json(server);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'server',
            message: 'Error fetching server',
            http_status: e.http_status,
            previous: e,
        });
    });
});

router.get('/:id/members', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        //TODO: Standardize error object + wrap error object
        res.status(401).json({
            type: 'internal',
            stage: 'server',
            message: `Malformed ID ${req.params.id}`,
            http_status: 401,
            previous: null,
        });
        return;
    }
    discordServer.getServer(req.params.id)
    .then((server) => {
        /* Boundary check */
        return checkServer(server, req);
    })
    .then(() => {
        return discordServer.getUsers(req.params.id);
    })
    .then((members) => {
        res.status(200).json(members);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'server',
            message: 'Error fetching server\'s members',
            http_status: e.http_status,
            previous: e,
        });
    });
});

router.get('/:id/proposals', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        //TODO: Standardize error object + wrap error object
        res.status(401).json({
            type: 'internal',
            stage: 'server',
            message: `Malformed ID ${req.params.id}`,
            http_status: 401,
            previous: null,
        });
        return;
    }
    discordServer.getServer(req.params.id)
    .then((server) => {
        /* Boundary check */
        return checkServer(server, req);
    })
    .then(() => {
        return dbServer.getProposals(req.params.id);
    })
    .then((proposals) => {
        res.status(200).json(proposals);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* e must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'server',
            message: 'Error fetching server\'s proposals',
            http_status: e.http_status,
            previous: e,
        });
    });
});

router.get('/:id/autocomplete', function(req, res) {
    // Returns an autocomplete object that contains server id, user ids, and role ids
    if(!checkSnowflake(req.params.id)) {
        //TODO: Standardize error object + wrap error object
        res.status(401).json({
            type: 'internal',
            stage: 'server',
            message: `Malformed ID ${req.params.id}`,
            http_status: 401,
            previous: null,
        });
        return;
    }
    discordServer.getServer(req.params.id)
    .then((server) => {
        /* Boundary check */
        return checkServer(server, req);
    })
    .then((server) => {
        // Retrieve data
        return Promise.all([
            discordServer.getRoles(req.params.id),
            discordServer.getUsers(req.params.id),
            Promise.resolve(server),
        ]);
    })
    .then(([roles, users, server]) => {
        res.status(200).json({
            roles,
            users: users.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    nick: user.nick,
                };
            }),
            server: {
                id: server.id,
                name: server.name,
            },
        });
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* e must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'server',
            message: 'Error fetching server\'s autocomplete data',
            http_status: e.http_status,
            previous: e,
        });
    });
});

module.exports = router;
