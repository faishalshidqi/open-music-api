/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('songs', 'fk_songs.albumid_albums.id', 'foreign key("albumId") references albums(id) on delete cascade')
};

exports.down = pgm => {
    pgm.dropConstraint('songs', 'fl_songs.albumid_albums.id')
};
