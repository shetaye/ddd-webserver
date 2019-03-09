const db = require('./db');

module.exports = {
    getProposal(id) {
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
            .where('proposal.proposal_id', id);
        const vote = db('proposal')
            .select(
                'proposal.proposal_id',
                'proposal.name',
                'proposal.author',
                'proposal.server',
                'proposal.created_on',
                'proposal.expires_in',
                'proposal.status')
            .sum({ y: db.raw('case when vote.vote = \'y\' then 1 else 0 end') })
            .sum({ n: db.raw('case when vote.vote = \'n\' then 1 else 0 end') })
            .innerJoin('vote', 'proposal.proposal_id', 'vote.proposal_id')
            .where('proposal.proposal_id', id);
        return Promise.all([action, vote])
        .then(([actionResults, voteResults]) => {
            if(actionResults.length == 0) {
                return Promise.reject({
                    type: 'db',
                    stage: 'proposal',
                    message: 'Proposal not found',
                    http_status: 404,
                    previous: null,
                });
            }
            else {
                /* Really could be voteResults too... */
                const proposal = actionResults[0];
                const proposalVote = voteResults[0];
                const actions = actionResults.map((row) => {
                    return {
                        position: row.position,
                        code: row.code,
                    };
                });
                return {
                    id: proposal.proposal_id,
                    name: proposal.name,
                    author: proposal.author,
                    createdOn: proposal.created_on,
                    expiresOn: proposal.created_on + proposal.expires_in,
                    server: proposal.server,
                    actions: actions,
                    status: proposal.status,
                    votes: [parseInt(proposalVote.y), parseInt(proposalVote.n)],
                };
            }
        });
    },
};