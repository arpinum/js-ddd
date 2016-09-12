'use strict';

const should = require('chai').should();
const jwt = require('jsonwebtoken');
const TokenService = require('./TokenService');

const JWT_REGEX = new RegExp('.*\..*\..*');

describe('The token service', () => {
  let tokenService;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  it('should create a token based on user', () => {
    let token = tokenService.create({key: 'value'});

    token.should.match(JWT_REGEX);
    let decoded = jwt.decode(token);
    decoded.key.should.equal('value');
    should.exist(decoded.exp);
  });

  it('should verify successfully a valid token', () => {
    let token = tokenService.create({key: 'value'});

    return tokenService.verify(token).should.eventually.include({key: 'value'});
  });

  it('should verify with failure an invalid token', () => {
    return tokenService.verify('invalid').should.be.rejected;
  });
});
