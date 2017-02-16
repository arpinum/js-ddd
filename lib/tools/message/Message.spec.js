'use strict';

const Message = require('./Message');

describe('A message', () => {

  it('should be created with a type and the payload', () => {
    let message = Message({type: 'Tadaa', payload: {the: 'payload'}});

    message.type.should.equal('Tadaa');
    message.payload.should.deep.equal({the: 'payload'});
  });

  it('could be created with additional properties', () => {
    let message = Message({type: 'Tadaa', payload: {the: 'payload'}, category: 'Important'});

    message.category.should.equal('Important');
  });

  it('should clone the payload to avoid further modifications', () => {
    let payload = {key: 'payload'};

    let message = Message({type: 'Tadaa', payload});

    payload.key = 'modified payload';
    message.payload.key.should.equal('payload');
  });

  it('could be created with no payload at all', () => {
    let message = Message({type: 'Tadaa'});

    message.payload.should.deep.equal({});
  });
});
