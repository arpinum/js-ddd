'use strict';

require('chai').should();
const TechnicalError = require('./TechnicalError');

describe('A technical error', () => {

  it('should have a generic error message by default', () => {
    let error = new TechnicalError();

    error.message.should.equal('Technical error');
  });
});
