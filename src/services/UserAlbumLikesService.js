const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();

    this._cacheService = cacheService;
  }

  async addLikeToAlbum(userId, albumId) {
    const userAlbumLikes_id = `likes-${nanoid(16)}`;
    const query = {
      text: 'insert into user_album_likes values($1, $2, $3) returning id',
      values: [userAlbumLikes_id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan. Id tidak ditemukan');
    }

    await this._cacheService.delete(`user_album_likes: ${albumId}`);

    return result.rows[0].id;
  }

  async deleteLikeFromAlbum(userId, albumId) {
    const query = {
      text: 'delete from user_album_likes where user_id = $1 and album_id = $2 returning id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Like gagal dibatalkan');
    }

    await this._cacheService.delete(`user_album_likes: ${albumId}`);
  }

  async getUserLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`user_album_likes: ${albumId}`);

      return {
        count: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'select * from user_album_likes where album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`user_album_likes: ${albumId}`, JSON.stringify(result.rows.length));

      return {
        count: result.rows.length,
        source: 'db',
      };
    }
  }

  async verifyAlbumLikeByUser(userId, albumId) {
    const query = {
      text: 'select * from user_album_likes where user_id = $1 and album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.length;
  }
}

module.exports = UserAlbumLikesService;
