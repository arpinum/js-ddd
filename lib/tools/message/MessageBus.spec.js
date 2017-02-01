'use strict';

const {FunctionalError} = require('../../errors');
const promising = require('../promising');
const MessageBus = require('./MessageBus');
const Message = require('./Message');

describe('The message bus', () => {

  let bus;

  beforeEach(() => {
    bus = new MessageBus();
  });

  it('should broadcast the message to the handlers', () => {
    bus.register('MyMessage', () => Promise.resolve('first handler'));
    bus.register('MyMessage', () => Promise.resolve('second handler'));

    let broadcast = bus.broadcast({type: 'MyMessage'});

    return broadcast.should.eventually.deep.equal(['first handler', 'second handler']);
  });

  it('should broadcast the message to the only handler when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveHandlers: true});
    bus.register('MyMessage', () => Promise.resolve('the handler'));

    let broadcast = bus.broadcast({type: 'MyMessage'});

    return broadcast.should.eventually.equal('the handler');
  });

  it('wont allow multiple handlers when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveHandlers: true});
    bus.register('MyMessage', () => Promise.resolve('the handler'));

    let act = () => bus.register('MyMessage', () => Promise.resolve('other handler'));

    act.should.throw(FunctionalError);
  });

  it('should broadcast the message specified by type and payload to the handlers', () => {
    let broadcasts = [];
    bus.register('MyMessage', message => {
      return promising.try(() => broadcasts.push(message));
    });

    let broadcast = bus.broadcast('MyMessage', {the: 'payload'});

    return broadcast.then(() => {
      broadcasts.should.deep.equal([new Message('MyMessage', {the: 'payload'})]);
    });
  });

  it('wont broadcast to the wrong handler', () => {
    let broadcasts = [];
    bus.register('myRightMessage', () => {
      return promising.try(() => broadcasts.push('first handler'));
    });
    bus.register('myWrongMessage', () => {
      return promising.try(() => broadcasts.push('second handler'));
    });

    let broadcast = bus.broadcast({type: 'myRightMessage'});

    return broadcast.then(() => {
      broadcasts.should.deep.equal(['first handler']);
    });
  });

  it('should broadcast multiple messages', () => {
    let broadcasts = [];
    bus.register('message1', () => {
      broadcasts.push('handler 1');
      return 'handler 1';
    });
    bus.register('message2', () => {
      broadcasts.push('handler 2');
      return 'handler 2';
    });
    bus.register('message3', () => {
      broadcasts.push('handler 3');
      return 'handler 3';
    });

    let broadcast = bus.broadcastAll([{type: 'message1'}, {type: 'message2'}, {type: 'message3'}]);

    return broadcast.then(results => {
      broadcasts.should.deep.equal(['handler 1', 'handler 2', 'handler 3']);
      results.should.deep.equal([['handler 1'], ['handler 2'], ['handler 3']]);
    });
  });
});
