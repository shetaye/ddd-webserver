exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('action').del()
    .then(() => {
        return knex('proposal').del()
    })
    .then(() => {
        // Inserts seed entries
        return knex('proposal').insert([
            {
                proposal_id: '0',
                name: 'Jonas\'s Proposal',
                author: '118427639835918338',
                server: '339838865370120192',
                created_on: 1549754609,
                expires_in: 60000,
                status: 0,
            },
            {
                proposal_id: '1',
                name: 'Nicholas\'s Proposal',
                author: '118715872973029376',
                server: '339838865370120192',
                created_on: 1549754609,
                expires_in: 60000,
                status: 0,
            },
            {
                proposal_id: '2',
                name: 'Elliot\'s Proposal',
                author: '173186678263906307',
                server: '339838865370120192',
                created_on: 1549754609,
                expires_in: 60000,
                status: 0,
            },
        ]);
    });
};
