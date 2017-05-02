'use strict';

const ForbiddenError = require('./forbiddenError');

describe('An forbidden error', () => {
  let error;

  beforeEach(() => {
    error = new ForbiddenError();
  });

  it('should have a default message', () => {
    error.message.should.equal('Forbidden');
  });

  it('could have a custom message', () => {
    let error = new ForbiddenError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 403 as default code', () => {
    error.code.should.equal(403);
  });
});
