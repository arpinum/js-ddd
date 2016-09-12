'use strict';

const ClientError = require('./ClientError');

class UnauthorizedError extends ClientError {

  constructor(message) {
    super(message || 'Unauthorized', 401);
  }
}

module.exports = UnauthorizedError;
