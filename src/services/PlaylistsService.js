const { Pool } = require('pg');
const { nanoid } = require("nanoid");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const AuthorizationError = require("../exceptions/AuthorizationError");

class PlaylistsService {
     constructor(/*collaborationsService*/) {
          this._pool = new Pool()
          //this._collaborationsService = collaborationsService
     }

     async addPlaylist({ name, owner }) {
          const id = `playlist-${nanoid(16)}`

          const query = {
               text: 'insert into playlists values($1, $2, $3) returning id',
               values: [id, name, owner]
          }

          const result = await this._pool.query(query)

          if (!result.rows[0].id) {
               throw new InvariantError('Playlist gagal ditambahkan')
          }

          return result.rows[0].id
     }

     async getPlaylists(owner) {
          const query = {
               //text: `select playlists.id, playlists.name, playlists.owner from playlists left join collaborations on collaborations.playlist_id = playlists.id where playlists.owner = $1 or collaborations.user_id = $1 group by playlists.id`,
               text: 'select id, name, owner from playlists where owner = $1',
               values: [owner]
          }

          const result = await this._pool.query(query)
          return result.rows
     }

     async getPlaylistByOwner(id, owner) {
          const query = {
               text: 'select id, name, owner from playlists where owner = $1 and id = $2',
               values: [owner, id]
          }

          const result = await this._pool.query(query)
          return result.rows[0]
     }

     async deletePlaylistById(id) {
          const query = {
               text: 'delete from playlists where id = $1 returning id',
               values: [id]
          }

          const result = await this._pool.query(query)

          if (!result.rows.length) {
               throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
          }
     }

     async verifyPlaylistOwner(id, owner) {
          const query = {
               text: 'select * from playlists where id = $1',
               values: [id]
          }

          const result = await this._pool.query(query)
          if (!result.rows.length) {
               throw new NotFoundError('Playlist tidak ditemukan')
          }
          const playlist = result.rows[0]
          if (playlist.owner !== owner) {
               throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
          }
     }

     /*async verifyPlaylistAccess(playlistId, userId) {
          try {
               await this.verifyPlaylistOwner(playlistId, userId)
          } catch (error) {
               if (error instanceof NotFoundError) {
                    throw error
               }
               try {
                    await this._collaborationsService.verifyCollaborator(playlistId, userId)
               } catch {
                    throw error
               }
          }
     }*/
}

module.exports = PlaylistsService
