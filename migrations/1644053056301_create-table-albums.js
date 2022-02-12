/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('albums', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        name: {
            type: 'TEXT',
            notNull: true,
            required: true
        },
        year: {
            type: 'INTEGER',
            notNull: true,
            required: true
        },
        songs: {
            type: 'TEXT[]',
        }
    })
};

exports.down = pgm => {
    pgm.dropTable('albums')
};
