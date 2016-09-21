'use strict';

class ValidationError extends Error {

  constructor(message) {
    super();
    this.message = message || 'Validation error';
  }
}

module.exports = ValidationError;
