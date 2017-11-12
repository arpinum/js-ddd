'use strict';

const CustomError = require('./customError');

class FunctionalError extends CustomError {
  constructor(message) {
    super(message || 'Functionnal error');
  }
}

module.exports = FunctionalError;
