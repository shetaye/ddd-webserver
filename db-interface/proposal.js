const db = require('./db');
const { generateSnowflake } = require('../utils');

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
                'action.code',
                'action.p0',
                'action.p1',
                'action.p2')
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
                        p0: row.p0,
                        p1: row.p1,
                        p2: row.p2,
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
                    votes: [proposalVote.y ? parseInt(proposalVote.y) : 0, proposalVote.n ? parseInt(proposalVote.n) : 0],
                };
            }
        });
    },
    insertNewProposal(proposal) {
        const id = generateSnowflake();
        const proposalQ = db('proposal')
            .insert({
                proposal_id: id,
                name: proposal.name,
                author: proposal.author,
                created_on: proposal.createdOn,
                expires_in: proposal.expiresOn - proposal.createdOn,
                server: proposal.server,
                // All proposals start open
                status: 0,
            });
        proposalQ.then(() => {
            const idActions = proposal.actions.map(action => {
                return {
                    action_id: generateSnowflake(),
                    proposal_id: id,
                    position: action.position,
                    code: action.code,
                };
            });
            return db('action')
                // Actions are assumed to be pre-validated and formatted
                .insert(idActions);
        })
        .then(() => {
            return proposal;
        });
    },
};