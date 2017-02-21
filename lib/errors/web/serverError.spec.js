'use strict';

const ServerError = require('./serverError');

describe('A server error', () => {

  it('could be created with a message and code', () => {
    let error = new ServerError('my message', 501);

    error.message.should.equal('my message');
    error.code.should.equal(501);
  });

  it('should have a default message', () => {
    let error = new ServerError();

    error.message.should.equal('Server error');
  });

  it('should have 500 as default message', () => {
    let error = new ServerError('my message');

    error.code.should.equal(500);
  });
});
