'use strict';

const ClientError = require('./clientError');

describe('A client error', () => {

  it('could be created with a specific code and message', () => {
    let error = new ClientError('my message', 403);

    error.message.should.equal('my message');
    error.code.should.equal(403);
  });

  it('should have a generic message by default', () => {
    let error = new ClientError();

    error.message.should.equal('Client error');
  });

  it('should have a 400 as default code', () => {
    let error = new ClientError('my message');

    error.code.should.equal(400);
  });
});
