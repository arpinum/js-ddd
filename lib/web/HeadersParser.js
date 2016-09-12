'use strict';

const _ = require('lodash');

class HeadersParser {

  constructor(headers) {
    this._headers = headers || {};
  }

  get(header) {
    if (!header) {
      return null;
    }
    return _.find(this._headers, (value, key) => {
      return key.toLowerCase() === header.toLowerCase();
    });
  }
}

module.exports = HeadersParser;
