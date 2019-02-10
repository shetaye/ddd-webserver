exports.up = function(knex, Promise) {
    return knex.schema.createTable('vote', (voteTable) => {
        voteTable.increments('id')
            .primary();
        voteTable.string('user_id', 20)
            .notNullable();
        voteTable.string('proposal_id', 20)
            .notNullable()
            .index();
        voteTable.foreign('proposal_id')
            .references('id')
            .inTable('proposal');
        voteTable.enu('vote', ['y', 'n'])
            .notNullable();
    })
    .then(() => {
        return knex.schema.alterTable('proposal', (proposalTable) => {
            proposalTable.dropColumns('votes_y', 'votes_n');
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('vote')
    .then(() => {
        return knex.schema.alterTable('proposal', (proposalTable) => {
            proposalTable.integer('votes_y')
                .unsigned();
            proposalTable.integer('votes_n')
                .unsigned();
        });
    });
};
