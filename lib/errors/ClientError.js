'use strict';

const WebError = require('./WebError');

class ClientError extends WebError {

  constructor(message, code) {
    super(message || 'Client error', code || 400);
  }
}

module.exports = ClientError;
