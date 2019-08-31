const db = require('./db');

module.exports = {
    getVote(id, uid) {
        const votes = db.collection('proposals').doc(id).collection('votes').doc(uid);
        return votes.get().then((docSnap) => {
            if(!docSnap.exists) {
                return {
                    voted: false,
                };
            }
            return {
                voted: true,
                vote: docSnap.data().voteYes ? 'y' : 'n',
            };
        })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'voteGet',
                message: 'Vote Lookup Error',
                http_status: 500,
                previous: null,
            };
        });
    },
    removeVote(id, uid) {
        const vote = db.collection('proposals').doc(id).collection('votes').doc(uid);
        return vote.delete()
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'voteDelete',
                message: 'Vote Deletion Error',
                http_status: 500,
                previous: null
            };
        });
    },
    createVote(id, uid, vote) {
        const voteDoc = db.collection('proposals').doc(id).collection('votes').doc(uid);
        return voteDoc.create({ voteYes: vote == 'y' })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'voteCreate',
                message: 'Vote Creation Error (Vote may already exist)',
                http_status: 500,
                previous: null,
            };
        });
    },
    updateVote(id, uid, vote) {
        const voteDoc = db.collection('proposals').doc(id).collection('votes').doc(uid);
        return voteDoc.update({ voteYes: vote == 'y' })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'voteUpdate',
                message: 'Vote Update Error (Vote may not exist)',
                http_status: 500,
                previous: null,
            };
        });
    },
};
/*
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
*/
