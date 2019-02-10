exports.up = function(knex, Promise) {
    return knex.schema.createTable('proposal', (proposalTable) => {
        proposalTable.bigInteger('id')
            .unsigned()
            .notNullable()
            .primary();
        proposalTable.index('id');
        proposalTable.string('name');
        proposalTable.bigInteger('author')
            .unsigned()
            .notNullable();
        proposalTable.bigInteger('server')
            .unsigned()
            .notNullable();
        proposalTable.integer('created_on')
            .unsigned()
            .notNullable();
        proposalTable.integer('expires_in')
            .unsigned();
        proposalTable.integer('status');
        proposalTable.integer('votes_y')
            .unsigned();
        proposalTable.integer('votes_n')
            .unsigned();
    });
};

exports.down = function(knex, Promise) {
    return knex.dropTableIfExists('proposal');
};
