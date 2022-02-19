const ClientError = require('../../exceptions/ClientError');

class LikesHandler {
    constructor(userAlbumLikesService, albumsService,) {
        this._userAlbumLikesService = userAlbumLikesService
        this._albumsService = albumsService

        this.postLikeToAlbumHandler = this.postLikeToAlbumHandler.bind(this)
        this.getLikesCountHandler = this.getLikesCountHandler.bind(this)
    }

    async postLikeToAlbumHandler(request, h) {
        try {
            const { id: userId } = request.auth.credentials
            const { albumId } = request.params

            await this._albumsService.checkIfAlbumExist(albumId)

            const liked = await this._userAlbumLikesService.verifyAlbumLikeByUser(userId, albumId)

            if (!liked) {
                const likeId = await this._userAlbumLikesService.addLikeToAlbum(userId, albumId)
                const response = h.response({
                                                status: 'success',
                                                message: 'Like ditambahkan'
                                            })
                response.code(201)
                return response
            }

            await this._userAlbumLikesService.deleteLikeFromAlbum(userId, albumId)

            const response = h.response({
                status: 'success',
                message: 'Like dibatalkan'
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

    async getLikesCountHandler(request, h) {
        try {
            const { albumId } = request.params
            const likesCount = await this._userAlbumLikesService.getLikesCount(albumId)

            const response = h.response({
                status: 'success',
                data: {
                    likes: likesCount
                }
            })
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

module.exports = LikesHandler
