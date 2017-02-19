'use strict';

const {EntityNotFoundError} = require('./entityNotFoundError');

describe('The entity not found error', () => {

  it('should be created with a message based on criteria', () => {
    let error = new EntityNotFoundError({a: 'criterion'});

    error.message.should.equal('No entity for {"a":"criterion"}');
  });
});
