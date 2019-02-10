const db = require('./db');

module.exports = {
    getServer(id) {
        return Promise.resolve(undefined);
    },
    getProposals(id) {
        return db('proposal').where('server', BigInt(id))
        .then((results) => {
            return results.map((proposal) => {
                return {
                    id: proposal.id,
                    name: proposal.name,
                    author: proposal.author,
                    createdOn: proposal.created_on,
                    expiresOn: proposal.created_on + proposal.expires_in,
                    server: proposal.server,
                    actions: [],
                    status: proposal.status,
                    votes: [proposal.votes_y, proposal.votes_n],
                };
            });
        });
    },
};