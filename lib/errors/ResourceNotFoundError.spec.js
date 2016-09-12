'use strict';

require('chai').should();
var ResourceNotFoundError = require('./ResourceNotFoundError');

describe('A resource not found error', () => {
  var error;

  beforeEach(() => {
    error = new ResourceNotFoundError();
  });

  it('should have a default message', () => {
    error.message.should.equal('Resource not found');
  });

  it('could have a custom message', () => {
    var error = new ResourceNotFoundError('Bleh');

    error.message.should.equal('Bleh');
  });

  it('should have 404 as default code', () => {
    error.code.should.equal(404);
  });
});
