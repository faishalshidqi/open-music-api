const Joi = require('joi')

const ExportPlaylist_SongsPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required()
})

module.exports = ExportPlaylist_SongsPayloadSchema
