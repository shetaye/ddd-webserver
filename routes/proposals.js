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
        res.status(401).json(`Malformed ID ${req.params.id}`);
        return;
    }
    dbProposal.getProposal(req.params.id)
    .then((proposal) => {
        res.status(200).json(proposal);
    })
    .catch((e) => {
        if(e.status) {
            console.log(e.status);
            if(e.status == 404) {
                res.status(404).json({ code: 3, error: 'Proposal not found' });
            }
        }
        else{
            console.log(e);
        }
        res.status(500).json({ code: 3, error: 'Internal server error' });
    });
});

router.get('/:id/author', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
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
    .then((result) => {
        const userdata = result.data;
        const avatar_hash = /avatars\/\d+\/([\d\w]+)\./g.exec(userdata.avatar);
        res.status(200).json({
            id: userdata.id,
            name: `${userdata.username}#${userdata.discriminator}`,
            avatar_hash: avatar_hash[1],
        });
    })
    .catch((e) => {
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
        res.status(500).json({ code: 3, error: 'Internal server error' });
    });
});

router.get('/:id/server', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
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
    .then((result) => {
        res.status(200).json(result.data);
    })
    .catch((e) => {
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
        res.status(500).json({ code: 3, error: 'Internal server error' });
    });
});

module.exports = router;
