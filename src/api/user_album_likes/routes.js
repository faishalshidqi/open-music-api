const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postUserLikeToAlbumHandler,
    options: {
      auth: 'open_music_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getUserLikesHandler,
  },
];

module.exports = routes;
