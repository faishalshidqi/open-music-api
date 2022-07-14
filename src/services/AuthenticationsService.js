const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: 'insert into authentications values($1)',
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'select token from authentications where token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Refresh Token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'delete from authentications where token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
