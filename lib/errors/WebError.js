'use strict';

class WebError extends Error {

  constructor(message, code) {
    super();
    this.message = message;
    this.code = code;
  }
}

module.exports = WebError;
