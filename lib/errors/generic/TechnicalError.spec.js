'use strict';

const TechnicalError = require('./TechnicalError');

describe('A technical error', () => {

  it('should have a generic error message by default', () => {
    let error = new TechnicalError();

    error.message.should.equal('Technical error');
  });

  it('should use provided message', () => {
    let error = new TechnicalError('Custom message');

    error.message.should.equal('Custom message');
  });
});
