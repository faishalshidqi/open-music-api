const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postLikeToAlbumHandler,
        //handler: handler.deleteLikeFromAlbumHandler,
        options: {
            auth: 'open_music_jwt'
        }
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getLikesCountHandler,
        options: {
            auth: 'open_music_jwt'
        }
    },
    /*{
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.deleteLikeFromAlbumHandler,
        options: {
            auth: 'open_music_jwt'
        }
    }*/
]

module.exports = routes
