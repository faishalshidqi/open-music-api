const UserAlbumLikesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'user_album_likes',
    version: '1.0.0',
    register: async (server, { userAlbumLikesService, albumsService}) => {
        const userAlbumLikesHandler = new UserAlbumLikesHandler(userAlbumLikesService, albumsService)
        server.route(routes(userAlbumLikesHandler))
    }
}
