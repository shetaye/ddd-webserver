const db = require('./db');
const { generateSnowflake } = require('../utils');

module.exports = {
    getProposal(id) {
        // Get proposal
        const proposal = db.collection('proposals').doc(id);
        const proposalData = proposal.get().then((proposalDoc) => {
            if(!proposalDoc.exists) {
                throw {
                    type: 'db',
                    stage: 'proposalLookup',
                    message: 'Proposal not found',
                    http_status: 404,
                    previous: null,
                };
            }
            return proposalDoc.data();
        });
        // Get vote data
        const votes = proposal.collection('votes');
        const voteNo = votes.where('voteYes', '==', false).get();
        const voteYes = votes.where('voteYes', '==', true).get();
        const voteData = Promise.all([voteNo, voteYes])
        .then(([votesNoSnapshot, votesYesSnapshot]) => {
            let no = 0;
            let yes = 0;
            if(!votesNoSnapshot.empty) { no = votesNoSnapshot.size; }
            if(!votesYesSnapshot.empty) { yes = votesYesSnapshot.size; }
            return { no, yes };
        });
        // Get action data
        const actions = proposal.collection('actions');
        const actionData = actions.get().then((snapshot) => {
            return snapshot.docs.map((action) => {
                return action.data();
            });
        });
        // Aggregate
        return Promise.all([proposalData, voteData, actionData])
        .then(([proposal, votes, actions]) => {
            return {
                id: id,
                name: proposal.name,
                author: proposal.author,
                createdOn: proposal.createdOn.toMillis(),
                expiresOn: proposal.expiresOn.toMillis(),
                server: proposal.server,
                actions: actions,
                status: proposal.status,
                votes: [votes.yes, votes.no],
            };
        })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'proposalGet',
                message: 'Proposal Lookup Error',
                http_status: 500,
                previous: null,
            };
        });
    },
    insertNewProposal(proposal) {
        // Create proposal
        const proposalDoc = db.collection('proposals').doc(generateSnowflake());
        const proposalSet = proposalDoc.set({
            name: proposal.name,
            author: proposal.author,
            createdOn: proposal.createdOn,
            expiresOn: proposal.expiresOn,
            server: proposal.server,
            status: proposal.status,
        });

        // Create actions
        const actions = proposal.collection('actions');
        const actionSets = Promise.all(proposal.actions.map((action) => {
            return actions.add(action);
        }));

        return Promise.all([proposalSet, actionSets])
        .then(() => {
            return proposal;
        })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'proposalInsert',
                message: 'Proposal Insert Error',
                http_status: 500,
                previous: null,
            };
        });
    },
};

/*
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
                throw {
                    type: 'db',
                    stage: 'proposalLookup',
                    message: 'Proposal not found',
                    http_status: 404,
                    previous: null,
                };
            }
            else {
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
        })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'proposalLookup',
                message: 'Proposal Lookup Error',
                http_status: e.http_status ? e.http_status : 500,
                previous: e.stage && e.message && e.type ? e : null,
            };
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
        })
        .catch((e) => {
            throw {
                type: 'db',
                stage: 'proposalInsertion',
                message: 'Proposal Insertion Error',
                http_status: e.http_status ? e.http_status : 500,
                previous: e.stage && e.message && e.type ? e : null,
            };
        });
    },
};
*/