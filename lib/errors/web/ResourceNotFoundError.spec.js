'use strict';

const ResourceNotFoundError = require('./ResourceNotFoundError');

describe('A resource not found error', () => {
  let error;

  beforeEach(() => {
    error = new ResourceNotFoundError();
  });

  it('should have a default message', () => {
    error.message.should.equal('Resource not found');
  });

  it('could have a custom message', () => {
    let error = new ResourceNotFoundError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 404 as default code', () => {
    error.code.should.equal(404);
  });
});
