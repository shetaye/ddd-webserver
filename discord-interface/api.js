const axios = require('axios');
const fs = require('fs');

let gatewayUrl, gatewayUser, gatewayPass;

fs.readFile('config.json', (err, data) => {
    if(err) throw err;
    const d = JSON.parse(data);
    gatewayUrl = d.gateway.url;
    gatewayUser = d.gateway.user;
    gatewayPass = d.gateway.pass;
    const encoded = Buffer.from(`${gatewayUser}:${gatewayPass}`, 'ascii').toString('base64');
    module.exports.gateway = axios.create({
        baseURL: gatewayUrl,
        headers: { 'Authorization': `Basic ${encoded}` },
    });
});

module.exports.discord = axios.create({
    baseURL: 'https://discordapp.com/api/v6',
});

