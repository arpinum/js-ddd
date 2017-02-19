'use strict';

class CustomError extends Error {

  constructor(message = 'Error') {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.message = this.message;
    this.name = this.constructor.name;
  }
}

module.exports = {CustomError};
