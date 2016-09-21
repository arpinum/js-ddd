'use strict';

class TechnicalError extends Error {

  constructor(message) {
    super();
    this.message = message || 'Technical error';
  }
}

module.exports = TechnicalError;
