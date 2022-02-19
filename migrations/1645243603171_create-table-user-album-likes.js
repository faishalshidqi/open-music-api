/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('user_album_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    })

    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', 'foreign key(user_id) references users(id) on delete cascade')
    pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', 'foreign key(album_id) references albums(id) on delete cascade')
};

exports.down = pgm => {
    pgm.dropTable('user_album_likes')

    pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id')
    pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id')
};
