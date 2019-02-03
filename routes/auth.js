const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');

const tokenUrl = 'https://discordapp.com/api/v6/oauth2/token';
let clientSecret, clientId;

fs.readFile('config.json', (err, data) => {
    if(err) throw err;
    const d = JSON.parse(data);
    clientSecret = d.auth.client_secret;
    clientId = d.auth.client_id;
});

//const { client_secret, client_id } = JSON.parse(fs.readFileSync('auth.json'));

router.post('/token', function(req, res) {
    /* Quick little validation */
    if(!req.body.code) {
        console.log('Oops');
        res.sendStatus(400);
        return;
    }
    axios({
        method: 'post',
        url: tokenUrl,
        params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: req.body.code,
            redirect_uri: 'http://ddd.io:1024/authRedirect',
            scope: 'identify guilds',
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    .then((response) => {
        /* big oof */
        res.status(200).json(response.data);
    }).catch(() => {
        res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/refresh', function(req, res) {

});

module.exports = router;
