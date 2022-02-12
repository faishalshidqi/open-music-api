const Joi = require('joi');
const Playlist_SongsPayloadSchema = Joi.object({
    songId: Joi.string().required(),
    playlistId: Joi.string()
})

module.exports = { Playlist_SongsPayloadSchema }
