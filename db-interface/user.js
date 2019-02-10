const db = require('./db');

module.exports = {
    getProposals(id) {
        const action = db('proposal')
            .select(
                'proposal.proposal_id',
                'proposal.name',
                'proposal.author',
                'proposal.server',
                'proposal.created_on',
                'proposal.expires_in',
                'proposal.status',
                'action.action_id',
                'action.position',
                'action.code')
            .innerJoin('action', 'proposal.proposal_id', 'action.proposal_id')
            .where('proposal.author', id);
        const vote = db('proposal')
            .select(
                'proposal.proposal_id',
                'proposal.name',
                'proposal.author',
                'proposal.server',
                'proposal.created_on',
                'proposal.expires_in',
                'proposal.status',
                db('vote')
                    .sum(db.raw('case when vote.vote = \'y\' then 1 else 0 end'))
                    .whereRaw('vote.proposal_id = proposal.proposal_id')
                    .as('y'),
                db('vote')
                    .sum(db.raw('case when vote.vote = \'n\' then 1 else 0 end'))
                    .whereRaw('vote.proposal_id = proposal.proposal_id')
                    .as('n'))
            .where('proposal.author', id)
            .groupBy('proposal.proposal_id');
        return Promise.all([action, vote])
        .then(([actionResults, voteResults]) => {
            if(actionResults.length == 0) {
                return Promise.reject({
                    status: 404,
                });
            }
            else {
                /* Really could be voteResults too... */
                /* Since we have multiple rows, we have to expand into a 2d array */
                const actionHash = actionResults.reduce((hash, row) => {
                    if(!hash.hasOwnProperty(row.proposal_id)) {
                        hash[row.proposal_id] = [];
                    }
                    hash[row.proposal_id].push(row);
                    return hash;
                });
                return voteResults.map((voteProposal) => {
                    const actions = actionHash[voteProposal.proposal_id].map((actionProposal) => {
                        return {
                            code: actionProposal.code,
                            position: actionProposal.position,
                        };
                    });
                    return {
                        id: voteProposal.proposal_id,
                        name: voteProposal.name,
                        author: voteProposal.author,
                        createdOn: voteProposal.created_on,
                        expiresOn: voteProposal.created_on + voteProposal.expires_in,
                        server: voteProposal.server,
                        actions: actions,
                        status: voteProposal.status,
                        votes: [parseInt(voteProposal.y), parseInt(voteProposal.n)],
                    };
                });
            }
        });
    },
};