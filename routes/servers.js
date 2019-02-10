const express = require('express');
const router = express.Router();

const { discordServer } = require('../discord-interface');

const { checkSnowflake } = require('../utils');

const { dbServer } = require('../db-interface');

router.get('/:id', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
        return;
    }
    discordServer.getServer(req.params.id)
    .then((result) => {
        res.status(200).json(result.data);
    })
    .catch((e) => {
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
    });
});

router.get('/:id/members', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
        return;
    }
    discordServer.getUsers(req.params.id)
    .then((result) => {
        res.status(200).json(result.data);
    })
    .catch((e) => {
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
    });
});

router.get('/:id/proposals', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
        return;
    }
    dbServer.getProposals(req.params.id)
    .then((proposals) => {
        res.status(200).json(proposals);
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({ code: 2, error: 'Internal server error' });
    });
});

module.exports = router;
