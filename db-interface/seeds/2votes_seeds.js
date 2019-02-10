exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('vote').del()
    .then(() => {
        // Inserts seed entries
        return knex('vote').insert([
            {
                user_id: '118495986380177417',
                proposal_id: '0',
                vote: 'y',
            },
            {
                user_id: '118495986380177417',
                proposal_id: '1',
                vote: 'n',
            },
            {
                user_id: '118495986380177417',
                proposal_id: '2',
                vote: 'y',
            },
            {
                user_id: '298932956905603072',
                proposal_id: '0',
                vote: 'y',
            },
            {
                user_id: '298932956905603072',
                proposal_id: '0',
                vote: 'n',
            },
            {
                user_id: '118495986380177417',
                proposal_id: '1',
                vote: 'y',
            },
            {
                user_id: '270247489343324171',
                proposal_id: '2',
                vote: 'n',
            },
            {
                user_id: '270247489343324171',
                proposal_id: '1',
                vote: 'y',
            },
        ]);
    });
};
