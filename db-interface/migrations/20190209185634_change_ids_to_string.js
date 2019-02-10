exports.up = function(knex, Promise) {
    return knex.schema.alterTable('proposal', (proposalTable) => {
        proposalTable.string('id', 20)
            .notNullable()
            .alter();
        proposalTable.string('author', 20)
            .notNullable()
            .alter();
        proposalTable.string('server', 20)
            .notNullable()
            .alter();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('proposal', (proposalTable) => {
        proposalTable.bigInteger('id')
            .unsigned()
            .notNullable()
            .primary()
            .alter();
        proposalTable.bigInteger('author')
            .unsigned()
            .notNullable()
            .alter();
        proposalTable.bigInteger('server')
            .unsigned()
            .notNullable()
            .alter();
    });
};
