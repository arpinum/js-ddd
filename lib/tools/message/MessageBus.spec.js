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

  it('should broadcast the message to the listeners', () => {
    bus.register('myMessage', () => Promise.resolve('first listener'));
    bus.register('myMessage', () => Promise.resolve('second listener'));

    let broadcast = bus.broadcast({type: 'myMessage'});

    return broadcast.should.eventually.deep.equal(['first listener', 'second listener']);
  });

  it('should broadcast the message to the only listener when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveListeners: true});
    bus.register('myMessage', () => Promise.resolve('the listener'));

    let broadcast = bus.broadcast({type: 'myMessage'});

    return broadcast.should.eventually.equal('the listener');
  });

  it('wont allow multiple listeners when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveListeners: true});
    bus.register('myMessage', () => Promise.resolve('the listener'));

    let act = () => bus.register('myMessage', () => Promise.resolve('other listener'));

    act.should.throw(FunctionalError);
  });

  it('should broadcast the message specified by type and payload to the listeners', () => {
    let broadcasts = [];
    bus.register('myMessage', message => {
      return promising.try(() => broadcasts.push(message));
    });

    let broadcast = bus.broadcast('myMessage', {the: 'payload'});

    return broadcast.then(() => {
      broadcasts.should.deep.equal([new Message('myMessage', {the: 'payload'})]);
    });
  });

  it('wont broadcast to the wrong listener', () => {
    let broadcasts = [];
    bus.register('myRightMessage', () => {
      return promising.try(() => broadcasts.push('first listener'));
    });
    bus.register('myWrongMessage', () => {
      return promising.try(() => broadcasts.push('second listener'));
    });

    let broadcast = bus.broadcast({type: 'myRightMessage'});

    return broadcast.then(() => {
      broadcasts.should.deep.equal(['first listener']);
    });
  });

  it('should broadcast multiple messages', () => {
    let broadcasts = [];
    bus.register('message1', () => {
      broadcasts.push('listener 1');
      return 'listener 1';
    });
    bus.register('message2', () => {
      broadcasts.push('listener 2');
      return 'listener 2';
    });
    bus.register('message3', () => {
      broadcasts.push('listener 3');
      return 'listener 3';
    });

    let broadcast = bus.broadcastAll([{type: 'message1'}, {type: 'message2'}, {type: 'message3'}]);

    return broadcast.then(results => {
      broadcasts.should.deep.equal(['listener 1', 'listener 2', 'listener 3']);
      results.should.deep.equal([['listener 1'], ['listener 2'], ['listener 3']]);
    });
  });
});
