const ExportPlaylist_SongsPayloadSchema = require('./schema')
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
    validateExportPlaylist_SongsPayload: (payload) => {
        const validationResult = ExportPlaylist_SongsPayloadSchema.validate(payload)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message)
        }
    }
}

module.exports = ExportsValidator
