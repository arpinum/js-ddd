'use strict';

const {FunctionalError} = require('./generic/functionalError');

class ValidationError extends FunctionalError {

  constructor(message) {
    super(message || 'Validation error');
  }
}

module.exports = {ValidationError};
