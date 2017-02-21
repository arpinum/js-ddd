'use strict';

const UnauthorizedError = require('./unauthorizedError');

describe('An unauthorized error', () => {
  let error;

  beforeEach(() => {
    error = new UnauthorizedError();
  });

  it('should have a default message', () => {
    error.message.should.equal('Unauthorized');
  });

  it('could have a custom message', () => {
    let error = new UnauthorizedError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 401 as default code', () => {
    error.code.should.equal(401);
  });
});
