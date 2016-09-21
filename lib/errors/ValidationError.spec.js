'use strict';

const ValidationError = require('./ValidationError');

describe('The validation error', () => {

  it('should have a generic error message by default', () => {
    let error = new ValidationError();

    error.message.should.equal('Validation error');
  });
});
