'use strict';

const QueriedObjectNotFoundError = require('./QueriedObjectNotFoundError');

describe('The queried object not found error', () => {

  it('should be created with a message based on criteria', () => {
    let error = new QueriedObjectNotFoundError({a: 'criterion'});

    error.message.should.equal('Queried object not found for {"a":"criterion"}');
  });
});
