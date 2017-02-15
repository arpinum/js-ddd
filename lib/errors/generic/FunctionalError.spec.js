'use strict';

const FunctionalError = require('./FunctionalError');

describe('A functionnal error', () => {

  it('should have a generic error message by default', () => {
    let error = new FunctionalError();

    error.message.should.equal('Functionnal error');
  });

  it('should use provided message', () => {
    let error = new FunctionalError('Custom message');

    error.message.should.equal('Custom message');
  });
});
