'use strict';

class FunctionalError extends Error {

  constructor(message) {
    super();
    this.message = message || 'Functionnal error';
  }
}

module.exports = FunctionalError;
