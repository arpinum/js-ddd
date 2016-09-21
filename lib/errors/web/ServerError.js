'use strict';

const WebError = require('./WebError');

class ServerError extends WebError {

  constructor(message, code) {
    super(message || 'Server error', code || 500);
  }
}

module.exports = ServerError;
