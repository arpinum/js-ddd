'use strict';

const AuthorizationError = require('./authorizationError');

describe('The authorization error', () => {
  it('should have a generic error message by default', () => {
    let error = new AuthorizationError();

    error.message.should.equal('Authorization error');
  });

  it('should allow default message overriding', () => {
    let error = new AuthorizationError('my error');

    error.message.should.equal('my error');
  });
});
