'use strict';

const FunctionalError = require('./generic/FunctionalError');

class ValidationError extends FunctionalError {

  constructor(message) {
    super(message || 'Validation error');
  }
}

module.exports = ValidationError;
