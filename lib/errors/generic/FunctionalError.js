'use strict';

const CustomError = require('./CustomError');

class FunctionalError extends CustomError {

  constructor(message) {
    super(message || 'Functionnal error');
  }
}

module.exports = FunctionalError;
