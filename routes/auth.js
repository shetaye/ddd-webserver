const express = require('express');
const router = express.Router();
const fs = require('fs');
const axios = require('axios');
const btoa = require('btoa');

const tokenUrl = 'https://discordapp.com/api/oauth2/token';
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
            grant_type: 'authorization_code',
            code: req.body.code,
            redirect_uri: 'http://ddd.io:1024/authRedirect',
            scope: 'identify guilds',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
    })
    .then((response) => {
        res.status(200).json(response.data);
    }).catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* e must be an axios error */
        if(!e.response) {
            res.status(500).json({
                type: 'axios',
                stage: 'auth',
                message: 'Internal server error',
                http_status: 500,
                previous: null,
            });
            return;
        }
        res.status(e.response.status).json({
            type: 'axios',
            stage: 'auth',
            message: 'Internal auth error',
            http_status: e.response.status,
            previous: e.response.data,
        });
    });
});

router.post('/refresh', function(req, res) {
    if(!req.body.refresh_token) {
        console.log('Oops');
        res.sendStatus(400);
        return;
    }
    axios({
        method: 'post',
        url: tokenUrl,
        params: {
            grant_type: 'refresh_token',
            refresh_token: req.body.refresh_token,
            redirect_uri: 'http://ddd.io:1024/authRedirect',
            scope: 'identify guilds',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
    })
    .then((response) => {
        res.status(200).json(response.data);
    }).catch((e) => {
        //TODO: Standardize error object + wrap error object
        /* e must be an axios error */
        if(!e.response) {
            res.status(500).json({
                type: 'axios',
                stage: 'auth',
                message: 'Internal auth error while requesting',
                http_status: 500,
                previous: null,
            });
            return;
        }
        res.status(e.response.status).json({
            type: 'axios',
            stage: 'auth',
            message: 'Internal auth error',
            http_status: e.response.status,
            previous: e.response.data,
        });
    });
});

module.exports = router;
