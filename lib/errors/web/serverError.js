'use strict';

const WebError = require('./webError');

class ServerError extends WebError {
  constructor(message, code) {
    super(message || 'Server error', code || 500);
  }
}

module.exports = ServerError;
