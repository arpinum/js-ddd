'use strict';

const EntityFrozenError = require('./EntityFrozenError');

describe('The entity frozen error', () => {

  it('should be created with a message based on id', () => {
    let error = new EntityFrozenError('the_id');

    error.message.should.equal('Entity the_id is frozen');
  });
});
