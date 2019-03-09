const express = require('express');
const router = express.Router();

const { discordUser } = require('../discord-interface');

const { dbUser } = require('../db-interface');

const { checkSnowflake } = require('../utils');

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
    /* Special case for ID 0 (Returns the current user info) */
    if(req.params.id == 0) {
        /* Reuse from auth query */
        res.status(200).json(req.currentUser);
        return;
    }
    discordUser.getUser(req.params.id)
    .then((user) => {
        res.status(200).json(user);
    })
    .catch((e) => {
        /* e must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'user',
            message: 'Error fetching user',
            http_status: 401,
            previous: e,
        });
        /*
        if(e.reponse) {
            console.log(e.reponse.status);
            console.log(e.response.data);
            if(e.response.status == 404) {
                res.status(404).json({ code: 1, error: 'User not found' });
            }
        }
        else{
            console.log(e.message);
        }
        res.status(500).json({ code: 1, error: 'Internal server error' });
        */
    });
});

router.get('/:id/servers', function(req, res, next) {
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
    discordUser.getServers(req.params.id)
    .then((servers) => {
        res.status(200).json(servers);
    })
    .catch((e) => {
        /* Must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'user',
            message: 'Error fetching user\'s servers',
            http_status: e.http_status,
            previous: e,
        });
        /*
        if(e.reponse) {
            console.log(e.reponse.status);
            console.log(e.response.data);
            if(e.response.status == 404) {
                res.status(404).json({ code: 1, error: 'User not found' });
            }
        }
        else{
            console.log(e.message);
        }
        res.status(500).json({ code: 1, error: 'Internal server error' });
        */
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
    dbUser.getProposals(req.params.id)
    .then((proposals) => {
        res.status(200).json(proposals);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'server',
            message: 'Error fetching user\'s proposals',
            http_status: e.http_status,
            previous: e,
        });
        /*
        console.log(e);
        res.status(500).json({ code: 1, error: 'Internal server error' });
        */
    });
});

module.exports = router;
