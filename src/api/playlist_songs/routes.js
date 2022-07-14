const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postPlaylist_SongHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getPlaylist_SongsHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deletePlaylist_SongsByIdHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
];

module.exports = routes;
