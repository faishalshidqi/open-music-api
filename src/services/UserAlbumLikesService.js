const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UserAlbumLikesService {
    constructor() {
        this._pool = new Pool()
    }

    async addLikeToAlbum(userId, albumId) {
        const userAlbumLikes_ID = `likes-${nanoid(16)}`
        const query = {
            text: 'insert into user_album_likes values($1, $2, $3) returning id',
            values: [userAlbumLikes_ID, userId, albumId]
        }

        const result = await this._pool.query(query)
        if (!result.rows[0].id) {
            throw new InvariantError('Like gagal ditambahkan')
        }

        return result.rows[0].id
    }

    async getLikesCount(albumId) {
        const query = {
            text: 'select * from user_album_likes where album_id = $2',
            values: [albumId]
        }

        const result = await this._pool.query(query)
        return result.rows.length
    }

    async deleteLikeFromAlbum(userId, albumId) {
        const query = {
            text: 'delete from user_album_likes where user_id = $1 and album_id = $2 returning id',
            values: [userId, albumId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new NotFoundError('Like gagal dibatalkan. Id tidak ditemukan')
        }
    }

    async verifyAlbumLikeByUser(userId, albumId) {
        const query = {
            text: 'select user_id, album_id from user_album_likes where user_id = $1 and album_id = $2 returning id',
            values: [userId, albumId]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new AuthenticationError('Anda belum memberikan like di album ini')
        }
    }
}

module.exports = UserAlbumLikesService
