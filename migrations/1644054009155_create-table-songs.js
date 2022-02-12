/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true,
            required: true
        },
        year: {
            type: 'INTEGER',
            notNull: true,
            required: true
        },
        genre: {
            type: 'TEXT',
            notNull: true,
            required: true
        },
        performer: {
            type: 'TEXT',
            notNull: true,
            required: true
        },
        duration: {
            type: 'INTEGER'
        },
        albumId: {
            type: 'VARCHAR(50)'
        }
    })
};

exports.down = pgm => {pgm.dropTable('songs')};
