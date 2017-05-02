'use strict';

const FunctionalError = require('./generic/functionalError');

class AuthorizationError extends FunctionalError {

  constructor(message) {
    super(message || 'Authorization error');
  }
}

module.exports = AuthorizationError;
