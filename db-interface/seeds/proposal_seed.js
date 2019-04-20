const { generateSnowflake } = require('../../utils');
exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    /* Generate ids */
    // User id mappings used to generate proposal names and such
    const userIDs = {
        '118427639835918338': 'Jonas',
        '118715872973029376': 'Nibolas',
        '173186678263906307': 'Senator Brill',
    };
    const serverIDs = [
        '339838865370120192',
    ];
    const proposals = [];
    const actions = [];
    const votes = [];
    // Generate a proposal for every user
    for(let id in userIDs) {
        proposals.push({
            proposal_id: generateSnowflake(),
            name: `${userIDs[id]}'s Proposal`,
            author: id,
            // random server
            server: serverIDs[Math.floor(Math.random() * serverIDs.length)],
            created_on: Math.floor(Date.now() / 1000),
            expires_in: Math.floor(Math.random() * 10000) + 60000,
            status: 0,
        });
    }
    // Generate a random action set and vote set for each proposal
    proposals.map(proposal => {
        // Between 1 and 10 actions
        for(let i = 0; i < Math.floor(Math.random() * 10) + 1; i++) {
            actions.push({
                action_id: generateSnowflake(),
                proposal_id: proposal.proposal_id,
                position: i,
                // TODO: Make actual codes
                code: 0,
            });
        }
        // Each user will may end up voting for a proposal (y, n) or not
        for(let id in userIDs) {
            let vote = Math.round(Math.random() * 2);
            switch(vote) {
                case 0:
                    // User does not vote
                    continue;
                case 1:
                    vote = 'y';
                break;
                case 2:
                    vote = 'n';
                break;
            }
            votes.push({
                vote_id: generateSnowflake(),
                user_id: id,
                proposal_id: proposal.proposal_id,
                vote: vote,
            });
        }
    });
    console.log(votes);
    return knex('action').del()
    .then(() => {
        return knex('vote').del();
    })
    .then(() => {
        return knex('proposal').del();
    })
    .then(() => {
        // Inserts seed entries
        return knex('proposal').insert(proposals);
    })
    .then(() => {
        return Promise.all([
            knex('vote').insert(votes),
            knex('action').insert(actions),
        ]);
    });
};
