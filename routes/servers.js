const express = require('express');
const router = express.Router();

const { discordServer } = require('../discord-interface');

const { checkSnowflake } = require('../utils');

const { dbServer } = require('../db-interface');

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
        /*
        if(e.reponse) {
            console.log(e.reponse.status);
            console.log(e.response.data);
            if(e.response.status == 404) {
                res.status(404).json({ code: 2, error: 'Server not found' });
            }
        }
        else{
            console.log(e.message);
        }
        res.status(500).json({ code: 2, error: 'Internal server error' });
        */
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
    discordServer.getUsers(req.params.id)
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
        /*
        if(e.reponse) {
            console.log(e.reponse.status);
            console.log(e.response.data);
            if(e.responsestatus == 404) {
                res.status(404).json({ code: 2, error: 'Server not found' });
            }
        }
        else{
            console.log(e.message);
        }
        res.status(500).json({ code: 2, error: 'Internal server error' });
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
    dbServer.getProposals(req.params.id)
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
        /*
        console.log(e);
        res.status(500).json({ code: 2, error: 'Internal server error' });
        */
    });
});

module.exports = router;
