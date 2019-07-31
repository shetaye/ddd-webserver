const { generateSnowflake } = require('../../utils');
exports.seed = function(knex, Promise) {
    function randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    /* Generate ids */
    // User id mappings used to generate proposal names and such
    const userIDs = {
        '118427639835918338': 'Jonas',
        '118715872973029376': 'Nibolas',
        '173186678263906307': 'Senator Brill',
        '289870812293365771': 'ZigZach',
        '340185571173335041': 'Stupid Commie',
    };
    const roleIDs = [
        '454991932133867534', /* Robot */
        '502937547857461248', /* Party Elite */
        '465683766153838602', /* Party Member */
        '492109087836864515', /* Citizen */
        // '339838865370120192', /* @everyone */
    ];
    const channelIDs = [
        '472536936536604672', /* general */
        '507394278562070529', /* polls */
        '339838865370120193', /* General 1 (voice) */
    ]
    const serverIDs = [
        '339838865370120192', /* URC */
    ];
    const actionCodes = {
        // Kick
        1000: [ randomFrom(Object.keys(userIDs)), 'Stupid kick reason', null ],
        // Ban
        1001: [ randomFrom(Object.keys(userIDs)), 'Stupid ban reason', null ],
        // Add role
        2000: [ 'A new role', null, null ],
        // Set role permission to 'allow'
        2001: [ randomFrom(roleIDs), 'rolePermissionWIP', null ],
        // Set role permission to 'prohibit'
        2002: [ randomFrom(roleIDs), 'rolePermissionWIP', null ],
        // Turn role setting 'on'
        2003: [ randomFrom(roleIDs), 'roleSettingWIP', null ],
        // Turn role setting 'off'
        2004: [ randomFrom(roleIDs), 'roleSettingWIP', null ],
        // Move role position
        2005: [ randomFrom(roleIDs), 4, null ],
        // Remove role
        2006: [ randomFrom(roleIDs), null, null ],
        // Add user to role
        2007: [ randomFrom(roleIDs), randomFrom(Object.keys(userIDs)), null ],
        // Remove user from role
        2008: [ randomFrom(roleIDs), randomFrom(Object.keys(userIDs)), null ],
        // Add channel
        3000: [ 'A new channel', null, null ],
        // Remove channel
        3001: [ randomFrom(channelIDs), null, null ],
        // Set channel override to 'prohibit'
        3002: [ randomFrom(channelIDs), randomFrom(roleIDs), 'channelPermissionWIP' ],
        // Set channel override to 'role default'
        3003: [ randomFrom(channelIDs), randomFrom(roleIDs), 'channelPermissionWIP' ],
        // Set channel override to 'allow'
        3004: [ randomFrom(channelIDs), randomFrom(roleIDs), 'channelPermissionWIP' ],
        // Move channel override's position
        3005: [ randomFrom(channelIDs), randomFrom(roleIDs), 4 ],
        // Remove channel override
        3006: [ randomFrom(channelIDs), randomFrom(roleIDs), null ],
        // Modify channel settings
        3007: [ randomFrom(channelIDs), 'channelSettingWIP', 'channelSettingValueWIP' ],
        // Change server settings
        4000: [ 'serverSettingWIP', 'serverValueWIP', null ],
    };
    const proposals = [];
    const actions = [];
    const votes = [];
    // Generate a proposal for every user
    // eslint-disable-next-line
    for(let id in userIDs) {
        proposals.push({
            proposal_id: generateSnowflake(),
            name: `${userIDs[id]}'s Proposal`,
            author: id,
            // random server
            server: randomFrom(serverIDs),
            created_on: Math.floor(Date.now() / 1000),
            expires_in: Math.floor(Math.random() * 10000) + 60000,
            status: 0,
        });
    }
    // Generate a random action set and vote set for each proposal
    proposals.map(proposal => {
        // All actions
        for(let i = 0; i < Object.keys(actionCodes).length; i++) {
            const code = Object.keys(actionCodes)[i];
            const params = actionCodes[code];
            actions.push({
                action_id: generateSnowflake(),
                proposal_id: proposal.proposal_id,
                position: i,
                code: code,
                p0: params[0],
                p1: params[1],
                p2: params[2],
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
