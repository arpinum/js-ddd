'use strict';

const Bluebird = require('bluebird');
const {FunctionalError} = require('../../errors');
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

    let promise = bus.broadcast({type: 'myMessage'});

    return promise.should.eventually.deep.equal(['first listener', 'second listener']);
  });

  it('should broadcast the message to the only listener when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveListeners: true});
    bus.register('myMessage', () => Promise.resolve('the listener'));

    let promise = bus.broadcast({type: 'myMessage'});

    return promise.should.eventually.equal('the listener');
  });

  it('wont allow multiple listeners when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveListeners: true});
    bus.register('myMessage', () => Promise.resolve('the listener'));

    let act = () => bus.register('myMessage', () => Promise.resolve('other listener'));

    act.should.throw(FunctionalError);
  });

  it('should broadcast the message specified by type and payload to the listeners', () => {
    let broadcast = [];
    bus.register('myMessage', message => {
      return Bluebird.try(() => broadcast.push(message));
    });

    let promise = bus.broadcast('myMessage', {the: 'payload'});

    return promise.then(() => {
      broadcast.should.deep.equal([new Message('myMessage', {the: 'payload'})]);
    });
  });

  it('wont broadcast to the wrong listener', () => {
    let broadcast = [];
    bus.register('myRightMessage', () => {
      return Bluebird.try(() => broadcast.push('first listener'));
    });
    bus.register('myWrongMessage', () => {
      return Bluebird.try(() => broadcast.push('second listener'));
    });

    let promise = bus.broadcast({type: 'myRightMessage'});

    return promise.then(() => {
      broadcast.should.deep.equal(['first listener']);
    });
  });

  it('should broadcast multiple messages', () => {
    let broadcast = [];
    bus.register('message1', () => {
      broadcast.push('listener 1');
      return 'listener 1';
    });
    bus.register('message2', () => {
      broadcast.push('listener 2');
      return 'listener 2';
    });
    bus.register('message3', () => {
      broadcast.push('listener 3');
      return 'listener 3';
    });

    let promise = bus.broadcastAll([{type: 'message1'}, {type: 'message2'}, {type: 'message3'}]);

    return promise.then(results => {
      broadcast.should.deep.equal(['listener 1', 'listener 2', 'listener 3']);
      results.should.deep.equal([['listener 1'], ['listener 2'], ['listener 3']]);
    });
  });
});
