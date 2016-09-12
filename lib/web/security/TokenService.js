'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const Bluebird = require('bluebird');
const jwtVerify = Bluebird.promisify(jwt.verify);

class TokenService {

  constructor(options) {
    this._options = _.defaults(options || {}, {
      expirationInMinutes: 10080,
      secret: 'jwtSecret'
    });
  }

  create(payload) {
    let options = {
      algorithm: 'HS256',
      expiresIn: this._options.expirationInMinutes + 'm'
    };
    return jwt.sign(payload, this._options.secret, options);
  }

  verify(token) {
    let options = {
      algorithm: 'HS256'
    };
    return jwtVerify(token, this._options.secret, options);
  }
}

module.exports = TokenService;
