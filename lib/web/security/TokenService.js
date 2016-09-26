'use strict';

const _ = require('lodash');
const {verify, sign} = require('jsonwebtoken');
const {promise} = require('../../tools');

class TokenService {

  constructor(options) {
    this._options = _.defaults({}, options, {
      expirationInMinutes: 10080,
      secret: 'jwtSecret'
    });
  }

  create(payload) {
    let options = {
      algorithm: 'HS256',
      expiresIn: this._options.expirationInMinutes + 'm'
    };
    return sign(payload, this._options.secret, options);
  }

  verify(token) {
    let options = {
      algorithm: 'HS256'
    };
    return promise.promisify(verify)(token, this._options.secret, options);
  }
}

module.exports = TokenService;
