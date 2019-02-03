const express = require('express');
const router = express.Router();

const { user } = require('../discord-interface');

const { checkSnowflake } = require('../utils');

router.get('/:id', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
        return;
    }
    user.getUser(req.params.id)
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
        if(e.reponse) {
            console.log(e.reponse.status);
            console.log(e.response.data);
            if(e.status == 404) {
                res.status(404).json({ code: 1, error: 'User not found' });
            }
        }
        else{
            console.log(e.message);
        }
        res.status(500).json({ code: 1, error: 'Internal server error' });
    });
});

router.get('/:id/servers', function(req, res, next) {
    if(!checkSnowflake(req.params.id)) {
        res.status(401).json(`Malformed ID ${req.params.id}`);
        return;
    }
    user.getServers(req.params.id)
    .then((result) => {
        res.status(200).json(result.data);
    })
    .catch((e) => {
        if(e.reponse) {
            console.log(e.reponse.status);
            console.log(e.response.data);
            if(e.status == 404) {
                res.status(404).json({ code: 1, error: 'User not found' });
            }
        }
        else{
            console.log(e.message);
        }
        res.status(500).json({ code: 1, error: 'Internal server error' });
    });
});

router.get('/:id/proposals', function(req, res, next) {
    new Promise((resolve) => setTimeout(() => resolve(['a', 'b', 'c'], 400)))
    .then((promises) => {
        res.status(200).json(promises);
    })
    .catch((e) => {
        console.log(e);
        res.status(500).json({ code: 1, error: 'Internal server error' })
    });
});

module.exports = router;
