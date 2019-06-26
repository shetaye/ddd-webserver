const db = require('./db');

module.exports = {
    getVote(id, uid) {
        const vote = db('vote')
            .select('vote.user_id',
                    'vote.vote')
            .where('vote.proposal_id', id)
            .andWhere('vote.user_id', uid);
        return vote
        .then((results) => {
            if(results.length == 0 || results[0].vote == 'nv') {
                return {
                    voted: false,
                };
            }
            else {
                return {
                    voted: true,
                    vote: results[0].vote,
                };
            }
        })
        .catch(() => {
            throw {
                type: 'db',
                stage: 'voteLookup',
                message: 'Vote Lookup Error',
                http_status: 500,
                previous: null,
            };
        });
    },
    updateElseInsertVote(id, uid, vote) {
        const voteQuery = db('vote')
            .where('vote.proposal_id', id)
            .andWhere('vote.user_id', uid)
            .update({
                vote: vote.vote,
            });
        return voteQuery
        .then(results => {
            if(!results) {
                const insert = db('vote')
                .where('vote.proposal_id', id)
                .andWhere('vote.user_id', uid)
                .insert({
                    proposal_id: id,
                    user_id: uid,
                    vote: vote.vote,
                });
                return insert;
            }
        })
        .then(results => {
            return results;
        })
        .catch(() => {
            throw {
                type: 'db',
                stage: 'voteLookup',
                message: 'Vote Lookup Error',
                http_status: 500,
                previous: null,
            };
        });
    },
};
