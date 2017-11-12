'use strict';

const ClientError = require('./clientError');

class ForbiddenError extends ClientError {
  constructor(message) {
    super(message || 'Forbidden', 403);
  }
}

module.exports = ForbiddenError;
