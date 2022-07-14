const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async checkIfSongsAvalaible(id) {
    const checkIfSongAvailable_Query = {
      text: 'select id from songs where id = $1',
      values: [id],
    };

    const checkResult = await this._pool.query(checkIfSongAvailable_Query);
    if (!checkResult.rows.length) {
      throw new NotFoundError('Lagu gagal ditambahkan. Id lagu tidak ditemukan');
    }
  }

  async addSong(
    {
      title, year, genre, performer, duration, albumId,
    },
  ) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'insert into songs values($1, $2, $3, $4, $5, $6, $7) returning id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongsByTitle(title) {
    const query = {
      text: 'select * from songs where title = $1',
      values: `%${title}%`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongsByPerformer(performer) {
    const query = {
      text: 'select * from songs where performer = $1',
      values: `%${performer}%`,
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongs(title, performer) {
    if (title && performer) {
      const query = {
        text: 'select id, title, performer from songs where lower(title) like $1 and lower(performer) like $2',
        values: [`%${title}%`, `%${performer}%`],
      };
      const result = await this._pool.query(query);
      return result.rows;
    }
    if (title || performer) {
      const query = {
        text: 'select id, title, performer from songs where lower(title) like $1 or lower(performer) like $2',
        values: [`%${title}%`, `%${performer}%`],
      };
      const result = await this._pool.query(query);
      return result.rows;
    }
    const result = await this._pool.query('select id, title, performer from songs');
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: 'select * from songs where id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'update songs set title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 where id = $7 returning id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'delete from songs where id = $1 returning id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
