exports.up = function(knex, Promise) {
    return knex.schema.createTable('action', (actionTable) => {
        actionTable.increments('id')
            .primary();
        actionTable.string('proposal_id', 20)
            .notNullable()
            .index();
        actionTable.foreign('proposal_id')
            .references('id')
            .inTable('proposal');
        actionTable.integer('position')
            .unsigned()
            .notNullable();
        actionTable.integer('code')
            .unsigned()
            .notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('action');
};
