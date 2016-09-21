'use strict';

require('chai').should();
var WebError = require('./WebError');

describe('A web error', () => {

  it('could be create with a message and code', () => {
    var error = new WebError('the message', 501);

    error.message.should.equal('the message');
    error.code.should.equal(501);
  });
});
