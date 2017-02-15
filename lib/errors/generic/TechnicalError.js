'use strict';

const CustomError = require('./CustomError');

class TechnicalError extends CustomError {

  constructor(message) {
    super(message || 'Technical error');
  }
}

module.exports = TechnicalError;
