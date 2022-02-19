const LikesHandler = require('./handler');
const routes = require('./routes')

module.exports ={
    name: 'likes',
    version: '1.0.0',
    register: async (server, { userAlbumLikesService }) => {
        const likesHandler = new LikesHandler(userAlbumLikesService)
        server.route(routes(likesHandler))
    }
}
