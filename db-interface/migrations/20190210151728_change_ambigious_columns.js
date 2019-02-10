exports.up = function(knex, Promise) {
    return knex.schema.alterTable('vote', (voteTable) => {
        voteTable.renameColumn('id', 'vote_id');
    })
    .then(() => {
        return knex.schema.alterTable('action', (actionTable) => {
            actionTable.renameColumn('id', 'action_id');
        });
    })
    .then(() => {
        return knex.schema.alterTable('proposal', (proposalTable) => {
            proposalTable.renameColumn('id', 'proposal_id');
        });
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('vote', (voteTable) => {
        voteTable.renameColumn('vote_id', 'id');
    })
    .then(() => {
        return knex.schema.alterTable('action', (actionTable) => {
            actionTable.renameColumn('action_id', 'id');
        });
    })
    .then(() => {
        return knex.schema.alterTable('proposal', (proposalTable) => {
            proposalTable.renameColumn('proposal_id', 'id');
        });
    });
};
