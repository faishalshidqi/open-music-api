const { Playlist_SongsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const Playlist_SongsValidator = {
    validatePlaylist_SongsPayload: (payload) => {
        const validationResult = Playlist_SongsPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = Playlist_SongsValidator
