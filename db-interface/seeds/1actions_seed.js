exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('action').del()
      .then(() => {
        // Inserts seed entries
        return knex('action').insert([
          {
              proposal_id: '0',
              position: 0,
              code: 0,
          },
          {
              proposal_id: '0',
              position: 1,
              code: 1,
          },
          {
              proposal_id: '0',
              position: 2,
              code: 1,
          },
          {
              proposal_id: '1',
              position: 0,
              code: 0,
          },
          {
              proposal_id: '2',
              position: 0,
              code: 1,
          },
          {
              proposal_id: '2',
              position: 1,
              code: 1,
          },
          {
              proposal_id: '1',
              position: 2,
              code: 0,
          },
        ]);
      });
  };