const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class Playlist_SongsService {
    constructor(/*collaborationsService*/) {
        this._pool = new Pool()
        //this._collaborationsService = collaborationsService

    }

    async addSongToPlaylist({ id: playlistId, songId }) {
        const id = `playlist_song-${nanoid(16)}`
        const query = {
            text: 'insert into playlist_songs values($1, $2, $3) returning id',
            values: [id, playlistId, songId]
        }

        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist')
        }
    }

    async getSongsFromPlaylist(id) {
        const query = {
            text: 'select songs.id, songs.title, songs.performer from songs left join playlist_songs on songs.id = playlist_songs.song_id where playlist_songs.playlist_id = $1',
            values: [id]
        }

        const result = await this._pool.query(query)
        return result.rows
    }

    async deleteSongFromPlaylistById(id, songId) {
        const query = {
            text: 'delete from playlist_songs where playlist_id = $1 and song_id = $2 returning id',
            values: [id, songId]
        }

        const result = await this._pool.query(query)
        if (!result.rows.length) {
            throw new InvariantError('Lagu gagal dihapus dari playlist')
        }
    }
}

module.exports = Playlist_SongsService
