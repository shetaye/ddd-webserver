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
        res.status(400).json({ error: 'Must provide Authentication' });
    }
    else{
        const token = authorization.split(' ')[1];
        discord.user.getCurrentUser(token)
        .then(() => {
            req.token = token;
            next();
        })
        .catch((e) => {
            if(e.response) {
                res.status(401).json({ code: 0, error: `Invalid token ${token}` });
            }
            else{
                res.status(500).json({ code: 0, error: 'Internal server error' });
            }
        });
    }
});
router.use('/proposals', proposalsRouter);
router.use('/servers', serverRouter);
router.use('/users', usersRouter);


module.exports = router;
