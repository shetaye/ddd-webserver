const express = require('express');
const router = express.Router();

const discord = require('../discord-interface');

const usersRouter = require('./users');
const proposalsRouter = require('./proposals');
const serverRouter = require('./servers');
const authRouter = require('./auth');

/* Allow CORS */
router.use(function(req, res, next) {
    res.header({
        'Access-Control-Allow-Origin': 'http://ddd.io:1024',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    });
    next();
});
router.use('/auth', authRouter);

/* Authentication checker */
router.use(function(req, res, next) {
    /* Passthrough for OPTIONS */
    if(req.method == 'OPTIONS') {
        next();
        return;
    }
    console.log(`User logging in with {Authorization: ${req.headers.authorization}}`);
    const authorization = req.headers.authorization;
    if(!authorization) {
        res.status(400).json({
            type: 'internal',
            stage: 'auth',
            message: 'Authentication required',
            http_status: 400,
            previous: null,
        });
    }
    else{
        const token = authorization.split(' ')[1];
        discord.discordUser.getCurrentUser(token)
        .then((user) => {
            req.currentUser = user;
            req.token = token;
            next();
        })
        .catch((e) => {
            /* e must be custom */
            res.status(e.http_status).json({
                type: 'discord',
                stage: 'auth',
                message: e.message,
                http_status: e.http_status,
                previous: e,
            });
        });
    }
});
router.use('/proposals', proposalsRouter);
router.use('/servers', serverRouter);
router.use('/users', usersRouter);


module.exports = router;
