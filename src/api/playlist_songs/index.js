const Playlist_SongsHandler = require("./handler");
const routes = require('./routes')

module.exports = {
    name: 'playlist_songs',
    version: '1.0.0',
    register: async (server, { playlist_SongsService, playlistsService, validator }) => {
        const playlist_SongsHandler = new Playlist_SongsHandler(playlist_SongsService, playlistsService, validator)
        server.route(routes(playlist_SongsHandler))
    }
}
