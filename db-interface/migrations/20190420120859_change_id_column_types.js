exports.up = function(knex, Promise) {
    return knex.schema.alterTable('vote', (voteTable) => {
        voteTable.string('vote_id', 20)
            .notNullable()
            .alter();
    })
    .then(() => {
        return knex.schema.alterTable('action', (actionTable) => {
            actionTable.string('action_id', 20)
                .notNullable()
                .alter();
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('vote', (voteTable) => {
        voteTable.increments('vote_id')
            .primary();
    }).then(() => {
        return knex.schema.alterTable('action', (actionTable) => {
            actionTable.increments('action_id')
                .primary();
        });
    });
};
