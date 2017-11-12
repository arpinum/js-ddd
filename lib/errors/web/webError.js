'use strict';

const CustomError = require('../generic/customError');

class WebError extends CustomError {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = WebError;
