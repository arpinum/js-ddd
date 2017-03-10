'use strict';

const {MessageContract} = require('../../types');
const Message = require('./message');

describe('A message', () => {

  it('should match MessageContract', () => {
    let message = new Message({type: 'Tadaa', payload: {the: 'payload'}});

    MessageContract.is(message).should.be.true;
  });

  it('should be created with a type and the payload', () => {
    let message = new Message({type: 'Tadaa', payload: {the: 'payload'}});

    message.type.should.equal('Tadaa');
    message.payload.should.deep.equal({the: 'payload'});
  });

  it('could be created with additional properties', () => {
    let message = new Message({type: 'Tadaa', payload: {the: 'payload'}, category: 'Important'});

    message.category.should.equal('Important');
  });

  it('should clone the payload to avoid further modifications', () => {
    let payload = {key: 'payload'};

    let message = new Message({type: 'Tadaa', payload});

    payload.key = 'modified payload';
    message.payload.key.should.equal('payload');
  });

  it('should shrink payload', () => {
    let payload = {key: 'payload', otherKey: undefined};

    let message = new Message({type: 'Tadaa', payload});

    message.payload.should.deep.equal({key: 'payload'});
  });

  it('could be created with no payload at all', () => {
    let message = new Message({type: 'Tadaa'});

    message.payload.should.deep.equal({});
  });
});