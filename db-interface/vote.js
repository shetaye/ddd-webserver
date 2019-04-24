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
            console.log(results);
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
        });
    },
    updateElseInsertVote(id, uid, vote) {
        const voteQuery = db('vote')
            .where('vote.proposal_id', id)
            .andWhere('vote.user_id', uid)
            .update({
                vote: vote.vote,
            });
        console.log(voteQuery.toSQL().toNative());
        return voteQuery
        .then(results => {
            if(!results) {
                console.log('Creating since update failed');
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
        });
    },
};
