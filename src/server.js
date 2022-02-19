require('dotenv').config()

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')
const path = require('path')

// albums and songs
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users')
const UsersService = require('./services/UsersService')
const UsersValidator = require('./validator/users')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// playlists
const playlists = require('./api/playlists')
const PlaylistsService = require('./services/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

// playlist_songs
const playlist_songs = require('./api/playlist_songs')
const Playlist_SongsService = require('./services/Playlist_SongsService')
const Playlist_SongsValidator = require('./validator/playlist_songs')

// collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// Exports
const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

// uploads
const uploads = require('./api/uploads')
const StorageService = require('./services/S3/StorageService')
const UploadsValidator = require('./validator/uploads')

// likes
const likes = require('./api/likes')
const UsersAlbumService = require('./services/UserAlbumLikesService')

const init = async () => {
    //const collaborationsService = new CollaborationsService()
    const playlistsService = new PlaylistsService(/*collaborationsService*/)
    const playlist_SongsService = new Playlist_SongsService()
    const albumsService = new AlbumsService()
    const songsService = new SongsService()
    const usersService = new UsersService()
    const authenticationsService = new AuthenticationsService()
    const storageService = new StorageService()
    const usersAlbumService = new UsersAlbumService()

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: Inert
        }
    ])

    server.auth.strategy('open_music_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id
            }
        })
    })

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                validator: AlbumsValidator
            }
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator
            }
        },
        {
            plugin: playlists,
            options: {
                playlistsService, usersService,
                validator: PlaylistsValidator
            }
        },
        {
            plugin: playlist_songs,
            options: {
                playlist_SongsService, playlistsService, songsService, usersService,
                validator: Playlist_SongsValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator
            }
        },
        /*{
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator
            }
        }*/
        {
            plugin: _exports,
            options: {
                ProducerService, playlistsService,
                validator: ExportsValidator
            }

        },
        {
            plugin: uploads,
            options: {
                storageService, albumsService,
                validator: UploadsValidator
            }
        },
        {
            plugin: likes,
            options: {
                service: usersAlbumService,
            }
        }
    ])


    await server.start()
    console.log(`Server running on ${server.info.uri}`)
}

init()
