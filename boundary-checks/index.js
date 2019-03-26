const proposal = require('./proposal');
const user = require('./user');
const server = require('./server');

module.exports = {
    checkProposal: proposal,
    checkUser: user,
    checkServer: server,
};