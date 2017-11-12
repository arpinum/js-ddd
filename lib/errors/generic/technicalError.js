'use strict';

const CustomError = require('./customError');

class TechnicalError extends CustomError {
  constructor(message) {
    super(message || 'Technical error');
  }
}

module.exports = TechnicalError;
