const express = require('express');
const router = express.Router();

const { dbProposal } = require('../db-interface');
const { discordUser, discordServer } = require('../discord-interface');

const { checkSnowflake } = require('../utils');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('All proposals');
});

router.get('/:id', function(req, res) {
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
    dbProposal.getProposal(req.params.id)
    .then((proposal) => {
        res.status(200).json(proposal);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'proposal',
            message: 'Error fetching proposal',
            http_status: e.http_status,
            previous: e,
        });
    });
});

router.get('/:id/author', function(req, res) {
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
    dbProposal.getProposal(req.params.id)
    .then((proposal) => {
        return proposal.author;
    })
    .then((authorId) => {
        console.log(`Finding user #${authorId}`);
        return discordUser.getUser(authorId);
    })
    .then((author) => {
        res.status(200).json(author);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status).json({
            type: e.type,
            stage: 'proposal',
            message: 'Error fetching proposal\'s author',
            http_status: e.http_status,
            previous: e,
        });
        /*
        if(e && e.status) {
            console.log(e.status);
            if(e.status == 404) {
                res.status(404).json({ code: 3, error: 'Proposal not found' });
            }
        }
        else if(e && e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        }
        else{
            console.log(e);
        }
        res.status(500).json({ code: 3, error: 'Internal server error' });*/
    });
});

router.get('/:id/server', function(req, res) {
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
    dbProposal.getProposal(req.params.id)
    .then((proposal) => {
        return proposal.server;
    })
    .then((serverId) => {
        console.log(`Finding server #${serverId}`);
        return discordServer.getServer(serverId);
    })
    .then((server) => {
        res.status(200).json(server);
    })
    .catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status).json({
            type: 'internal',
            stage: 'proposal',
            message: 'Error fetching proposal\'s server',
            http_status: e.http_status,
            previous: e,
        });
        /*
        if(e && e.status) {
            console.log(e.status);
            if(e.status == 404) {
                res.status(404).json({ code: 3, error: 'Proposal not found' });
            }
        }
        else if(e && e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
        }
        else{
            console.log(e);
        }
        res.status(500).json({ code: 3, error: 'Internal server error' });*/
    });
});

module.exports = router;
