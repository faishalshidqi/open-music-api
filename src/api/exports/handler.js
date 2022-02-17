const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
    constructor(producerService, playlistsService, validator) {
        this._producerService = producerService
        this._playlistsService = playlistsService
        this._validator = validator
        this.postExportPlaylist_SongsHandler = this.postExportPlaylist_SongsHandler.bind(this)
    }

    async postExportPlaylist_SongsHandler(request, h) {
        try {
            this._validator.validateExportPlaylist_SongsPayload(request.payload)
            const { playlistId } = request.params
            const owner = await this._playlistsService.getOwnerPlaylistById(playlistId)

            //console.log(`playlistId: ${playlistId}`)
            console.log(owner)
            await this._playlistsService.verifyPlaylistOwner(playlistId, owner)
            //await this._playlistsService.checkIfAccessorLegit(playlistId)
            await this._playlistsService.checkIfPlaylistsAvailable(playlistId)

            const message = {
                userId: request.auth.credentials.id,
                targetEmail: request.payload.targetEmail
            }

            await this._producerService.sendMessage('export:playlist_songs', JSON.stringify(message))
            const response = h.response({
                status: 'success',
                message: 'Permintaan Anda sedang kami proses',
                /*data: {
                    playlist: {
                        // TODO: get id, name, songs of the exported playlist
                        id: playlist.id,
                        name: playlist.name,
                        songs: songs
                    }
                }*/
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
}

module.exports = ExportsHandler
