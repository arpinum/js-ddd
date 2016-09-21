'use strict';

require('chai').should();
var UnauthorizedError = require('./UnauthorizedError');

describe('An unauthorized error', () => {
  var error;

  beforeEach(() => {
    error = new UnauthorizedError();
  });

  it('should have a default message', () => {
    error.message.should.equal('Unauthorized');
  });

  it('could have a custom message', () => {
    var error = new UnauthorizedError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 401 as default code', () => {
    error.code.should.equal(401);
  });
});
