exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('proposal').del()
    .then(() => {
      // Inserts seed entries
      return knex('proposal').insert([
        {
            id: 0,
            name: 'Jonas\'s Proposal',
            author: BigInt('118427639835918338'),
            server: BigInt('339838865370120192'),
            created_on: 1549754609,
            expires_in: 60000,
            status: 0,
            votes_y: 3,
            votes_n: 2,
        },
        {
            id: 1,
            name: 'Nicholas\'s Proposal',
            author: BigInt('118715872973029376'),
            server: BigInt('339838865370120192'),
            created_on: 1549754609,
            expires_in: 60000,
            status: 0,
            votes_y: 3,
            votes_n: 6,
        },
        {
            id: 2,
            name: 'Elliot\'s Proposal',
            author: BigInt('173186678263906307'),
            server: BigInt('339838865370120192'),
            created_on: 1549754609,
            expires_in: 60000,
            status: 0,
            votes_y: 6,
            votes_n: 2,
        },
      ]);
    });
};
