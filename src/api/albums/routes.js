const routes = (handler) => [
    /*{
        method: 'GET',
        path: '/albums/{albumId}',
        handler: handler.getDetailsAlbumByIdHandler
    },*/
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumByIdHandler
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumByIdHandler
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumByIdHandler
    },
]

module.exports = routes
