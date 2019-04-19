exports.up = function(knex, Promise) {
    return knex.schema.alterTable('vote', (voteTable) => {
        voteTable.dropColumn('vote');
    }).then(() => {
        return knex.schema.alterTable('vote', (voteTable) => {
            voteTable.enu('vote', ['y', 'n', 'nv'])
            .notNullable()
            .defaultTo('n');
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('vote', (voteTable) => {
        voteTable.dropColumn('vote');
    }).then(() => {
        return knex.schema.alterTable('vote', (voteTable) => {
            voteTable.enu('vote', ['y', 'n'])
            .notNullable()
            .defaultTo('n');
        });
    });
};
