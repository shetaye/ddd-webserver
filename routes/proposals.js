const express = require('express');
const router = express.Router();

const { dbProposal, dbVote } = require('../db-interface');

const { discordUser, discordServer } = require('../discord-interface');

const { checkSnowflake } = require('../utils');

const { checkProposal } = require('../boundary-checks');

const live = require('../livefeed');

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('All proposals');
});

router.get('/:id', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        // TODO: Standardize error object + wrap error object
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
        /* Boundary check */
        return checkProposal(proposal, req);
    })
    .then((proposal) => {
        res.status(200).json(proposal);
    })
    .catch((e) => {
        // TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status ? e.http_status : 500).json({
            type: 'db',
            stage: 'proposal',
            message: 'Error fetching proposal',
            http_status: e.http_status ? e.http_status : 500,
            previous: null,
        });
    });
});

router.get('/:id/vote', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        // TODO: Standardize error object + wrap error object
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
        /* Boundary check */
        // I can re use the boundary check
        // because you can vote on every proposal
        // you can see and you can see
        // every proposal you can vote on
        // In other words, 1:1 boundary
        return checkProposal(proposal, req);
    })
    .then((proposal) => {
        return dbVote.getVote(proposal.id, req.currentUser.id);
    })
    .then((vote) => {
        res.status(200).json(vote);
    })
    .catch((e) => {
        // TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status ? e.http_status : 500).json({
            type: e.type,
            stage: 'proposal',
            message: 'Error fetching proposal\'s vote',
            http_status: e.http_status ? e.http_status : 500,
            previous: e,
        });
    });
});
// Maybe split out into a DELETE function
router.post('/:id/vote', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        // TODO: Standardize error object + wrap error object
        res.status(401).json({
            type: 'internal',
            stage: 'server',
            message: `Malformed ID ${req.params.id}`,
            http_status: 401,
            previous: null,
        });
        return;
    }
    if(!req.body.vote) {
        // TODO: Standardize error object + wrap error object
        res.status(400).json({
            type: 'internal',
            stage: 'server',
            message: `Malformed vote ${req.body.vote}`,
            http_status: 400,
            previous: null,
        });
        return;
    }
    dbProposal.getProposal(req.params.id)
    .then((proposal) => {
        /* Boundary check */
        // I can re use the boundary check
        // because you can vote on every proposal
        // you can see and you can see
        // every proposal you can vote on.
        // In other words, 1:1 boundary
        return checkProposal(proposal, req);
    })
    .then(() => {
        const vote = req.body.vote;
        const user_id = req.currentUser.id;
        if(!vote.voted) {
            // Delete the vote row if it exists else return
            return dbVote.updateElseInsertVote(req.params.id, user_id, {
                voted: false,
                vote: 'nv',
            });
        }
        else {
            // Try to update row else create row
            if(!req.body.vote.vote) {
                // Throw error
                throw {
                    type: 'internal',
                    stage: 'proposal',
                    message: 'Vote required',
                    http_status: 400,
                    previous: null,
                };
            }
            return dbVote.updateElseInsertVote(req.params.id, user_id, vote);
        }
    })
    // TODO: Here, check vote and update if valid
    .then(() => {
        // Return updated proposal (Do a requery)
        return dbProposal.getProposal(req.params.id);
    })
    .then(proposal => {
        // We're at the point where req.body.vote MUST be
        // the current vote status for the user (we would have thrown and error if not)
        // Push out new vote info
        // Signal refetch
        live.sendEventTo('proposal', proposal.id, 'refetchProposal');
        res.status(200).json({
            proposal: proposal,
            vote: req.body.vote,
        });
    })
    .catch((e) => {
        // TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status ? e.http_status : 500).json({
            type: e.type,
            stage: 'proposal',
            message: 'Error updating proposal\'s vote',
            http_status: e.http_status ? e.http_status : 500,
            previous: e,
        });
    });
});

router.get('/:id/author', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        // TODO: Standardize error object + wrap error object
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
        /* Boundary check */
        return checkProposal(proposal, req);
    })
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
        // TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status ? e.http_status : 500).json({
            type: e.type,
            stage: 'proposal',
            message: 'Error fetching proposal\'s author',
            http_status: e.http_status ? e.http_status : 500,
            previous: null,
        });
    });
});

router.get('/:id/server', function(req, res) {
    if(!checkSnowflake(req.params.id)) {
        // TODO: Standardize error object + wrap error object
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
        /* Boundary check */
        return checkProposal(proposal, req);
    })
    .then((proposal) => {
        return proposal.server;
    })
    .then((serverId) => {
        console.log(`Finding server #${serverId}`);
        return discordServer.getServer(serverId);
    })
    .then((server) => {
        console.log(server);
        res.status(200).json(server);
    })
    .catch((e) => {
        // TODO: Standardize error object + wrap error object
        /* Must be custom */
        res.status(e.http_status ? e.http_status : 500).json({
            type: e.type,
            stage: 'proposal',
            message: 'Error fetching proposal\'s server',
            http_status: e.http_status ? e.http_status : 500,
            previous: null,
        });
    });
});

module.exports = router;
