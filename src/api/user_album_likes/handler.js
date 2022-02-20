const ClientError = require('../../exceptions/ClientError');

class UserAlbumLikesHandler {
    constructor(usersAlbumLikesService, albumsService) {
        this._usersAlbumLikesService = usersAlbumLikesService
        this._albumsService = albumsService

        this.postUserLikeToAlbumHandler = this.postUserLikeToAlbumHandler.bind(this)
        this.getUserLikesHandler = this.getUserLikesHandler.bind(this)
    }

    async postUserLikeToAlbumHandler(request, h) {
        try {
            const { id: albumId }  = request.params
            const { id: userId } = request.auth.credentials

            await this._albumsService.checkIfAlbumExist(albumId)

            const liked = await this._usersAlbumLikesService.verifyAlbumLikeByUser(userId, albumId)

            if (!liked) {
                await this._usersAlbumLikesService.addLikeToAlbum(userId, albumId)
                const response = h.response({
                    status: 'success',
                    message: 'Like berhasil ditambahkan'
                })
                response.code(201)
                return response
            }

            await this._usersAlbumLikesService.deleteLikeFromAlbum(userId, albumId)
            const response = h.response({
                status: 'success',
                message: 'Like berhasil dibatalkan'
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

    async getUserLikesHandler(request, h) {
        try {
            const { id: albumId } = request.params
            const likesCount = await this._usersAlbumLikesService.getUserLikesCount(albumId)

            const response = h.response({
                status: 'success',
                data: {
                    likes: likesCount.count
                }
            })
            response.header('X-Data-Source', likesCount.source)
            response.code(200)
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

module.exports = UserAlbumLikesHandler
