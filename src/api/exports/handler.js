const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    this.postExportPlaylist_SongsHandler = this.postExportPlaylist_SongsHandler.bind(this);
  }

  async postExportPlaylist_SongsHandler(request, h) {
    try {
      this._validator.validateExportPlaylist_SongsPayload(request.payload);
      const { playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

      const message = {
        playlistId,
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail,
      };

      await this._producerService.sendMessage('export:playlist_songs', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
