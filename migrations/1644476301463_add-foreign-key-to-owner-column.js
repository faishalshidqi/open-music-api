/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'foreign key(owner) references users(id) on delete cascade')
};

exports.down = pgm => {
    pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id')
};
