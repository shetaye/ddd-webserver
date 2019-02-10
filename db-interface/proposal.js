const db = require('./db');

module.exports = {
    getProposal(id) {
        return db('proposal').where('id', BigInt(id))
        .then((results) => {
            if(results.length == 0) {
                return Promise.reject({
                    status: 404,
                });
            }
            else {
                const proposal = results[0];
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
            }
        });
    },
};