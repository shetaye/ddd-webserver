exports.up = function(knex, Promise) {
    return knex.schema.alterTable('action', (actionTable) => {
        actionTable.string('p0', 255);
        actionTable.string('p1', 255);
        actionTable.string('p2', 255);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('action', (actionTable) => {
        actionTable.dropColumn('p0');
        actionTable.dropColumn('p1');
        actionTable.dropColumn('p2');
    });
};
