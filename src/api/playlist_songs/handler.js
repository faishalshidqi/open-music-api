const ClientError = require("../../exceptions/ClientError");

class Playlist_SongsHandler {
    constructor(playlist_SongsService, playlistsService, songsService, validator) {
        this._playlist_SongsService = playlist_SongsService
        this._playlistsService = playlistsService
        this._songsService = songsService
        this._validator = validator

        this.postPlaylist_SongHandler = this.postPlaylist_SongHandler.bind(this)
        this.getPlaylist_SongsHandler = this.getPlaylist_SongsHandler.bind(this)
        this.deletePlaylist_SongsByIdHandler = this.deletePlaylist_SongsByIdHandler.bind(this)
    }

    async postPlaylist_SongHandler(request, h) {
        try {
            this._validator.validatePlaylist_SongsPayload(request.payload)
            const { songId } = request.payload
            const { id } = request.params
            const { id: credentialId } = request.auth.credentials

            await this._playlistsService.verifyPlaylistAccess(id, credentialId)
            await this._songsService.checkIfSongsAvalaible(songId)
            await this._playlist_SongsService.addSongToPlaylist({ id, songId} )

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan pada playlist'
            })
            response.code(201)
            return response
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                                                status: 'fail',
                                                message: error.message
                                            })
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                                            status: 'error',
                                            message: 'Maaf, terjadi kegagalan pada server kami.'
                                        })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async getPlaylist_SongsHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials
            const { id } = request.params
            await this._playlistsService.verifyPlaylistOwner(id, credentialId)
            const playlist = await this._playlistsService.getPlaylists(id)
            console.log(playlist)
            const songs = await this._playlist_SongsService.getSongsFromPlaylist(id)

            return {
                status: 'success',
                data: {
                    playlist: {
                        playlist,
                        songs
                    }
                }
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                                                status: 'fail',
                                                message: error.message
                                            })
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                                            status: 'error',
                                            message: 'Maaf, terjadi kegagalan pada server kami.'
                                        })
            response.code(500)
            console.error(error)
            return response
        }
    }

    async deletePlaylist_SongsByIdHandler(request, h) {
        try {
            const { id } = request.params
            const { songId } = request.payload
            const { id: credentialId } = request.auth.credentials

            await this._playlistsService.verifyPlaylistAccess(id, credentialId)
            await this._playlist_SongsService.deleteSongFromPlaylistById(id, songId)
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist'
            }
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                                                status: 'fail',
                                                message: error.message
                                            })
                response.code(error.statusCode)
                return response
            }
            const response = h.response({
                                            status: 'error',
                                            message: 'Maaf, terjadi kegagalan pada server kami.'
                                        })
            response.code(500)
            console.error(error)
            return response
        }
    }
}


module.exports = Playlist_SongsHandler
