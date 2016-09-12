'use strict';

const Message = require('./Message');

describe('A message', () => {

  it('should be created with a type and the payload', () => {
    let message = new Message('tadaa', {the: 'payload'});

    message.type.should.equal('tadaa');
    message.payload.should.deep.equal({the: 'payload'});
  });

  it('should clone the payload to avoid further modifications', () => {
    let payload = {key: 'payload'};

    let message = new Message('tadaa', payload);

    payload.key = 'modified payload';
    message.payload.key.should.equal('payload');
  });

  it('could be created with no payload at all', () => {
    let message = new Message('tadaa');

    message.payload.should.deep.equal({});
  });
});
