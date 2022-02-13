const Playlist_SongsHandler = require("./handler");
const routes = require('./routes')

module.exports = {
    name: 'playlist_songs',
    version: '1.0.0',
    register: async (server, { playlist_SongsService, playlistsService, songsService, validator }) => {
        const playlist_SongsHandler = new Playlist_SongsHandler(playlist_SongsService, playlistsService, songsService, validator)
        server.route(routes(playlist_SongsHandler))
    }
}
