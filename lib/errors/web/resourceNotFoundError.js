const ClientError = require('./clientError');

class ResourceNotFoundError extends ClientError {
  constructor(message) {
    super(message || 'Resource not found', 404);
  }
}

module.exports = ResourceNotFoundError;
