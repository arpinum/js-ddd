'use strict';

const {try: asyncTry} = require('@arpinum/promise');
const {FunctionalError} = require('../../errors');
const {MessageBusContract} = require('../../types');
const MessageBus = require('./messageBus');
const Message = require('./message');

describe('The message bus', () => {

  let bus;

  beforeEach(() => {
    bus = new MessageBus();
  });

  it('should match MessageBusContract', () => {
    MessageBusContract.is(bus).should.be.true;
  });

  it('should broadcast the message to the handlers', () => {
    bus.register('MyMessage', () => Promise.resolve('first handler'));
    bus.register('MyMessage', () => Promise.resolve('second handler'));

    let broadcast = bus.broadcast({type: 'MyMessage'});

    return broadcast.then(result => {
      result.should.deep.equal(['first handler', 'second handler']);
    });
  });

  it('should promisify handlers', () => {
    bus.register('MyMessage', () => 'handler');

    let broadcast = bus.broadcast({type: 'MyMessage'});

    return broadcast.then(result => {
      result.should.deep.equal(['handler']);
    });
  });

  it('should broadcast the message to the only handler when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveHandlers: true});
    bus.register('MyMessage', () => Promise.resolve('the handler'));

    let broadcast = bus.broadcast({type: 'MyMessage'});

    return broadcast.then(result => {
      result.should.equal('the handler');
    });
  });

  it('wont allow multiple handlers when bus is configured as exclusive', () => {
    let bus = new MessageBus({exclusiveHandlers: true});
    bus.register('MyMessage', () => Promise.resolve('the handler'));

    let act = () => bus.register('MyMessage', () => Promise.resolve('other handler'));

    act.should.throw(FunctionalError);
  });

  it('wont broadcast to the wrong handler', () => {
    let broadcasts = [];
    bus.register('myRightMessage', () => {
      return asyncTry(() => broadcasts.push('first handler'));
    });
    bus.register('myWrongMessage', () => {
      return asyncTry(() => broadcasts.push('second handler'));
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

  it('should execute decorators before message handling', () => {
    let beforeHandle = [
      message => message.updatePayload({order: message.payload.order + '|first|'}),
      message => message.updatePayload({order: message.payload.order + '|second|'})
    ];
    let bus = new MessageBus({beforeHandle});
    let broadcastedMessage;
    bus.register('MyMessage', message => {
      broadcastedMessage = message;
      return Promise.resolve();
    });
    let message = new Message({type: 'MyMessage', payload: {order: '|initial|'}});

    let broadcast = bus.broadcast(message);

    return broadcast.then(() => {
      broadcastedMessage.should.deep.equal(new Message({
        type: message.type,
        date: message.date,
        payload: {
          order: '|initial||first||second|'
        }
      }));
    });
  });

  it('should execute async decorators before message handling', () => {
    let beforeHandle = [
      message => asyncTry(() => message.updatePayload({order: message.payload.order + '|first|'})),
      message => asyncTry(() => message.updatePayload({order: message.payload.order + '|second|'}))
    ];
    let bus = new MessageBus({beforeHandle});
    let broadcastedMessage;
    bus.register('MyMessage', message => {
      broadcastedMessage = message;
      return Promise.resolve();
    });
    let message = new Message({type: 'MyMessage', payload: {order: '|initial|'}});

    let broadcast = bus.broadcast(message);

    return broadcast.then(() => {
      broadcastedMessage.should.deep.equal(message.updatePayload({order: '|initial||first||second|'}));
    });
  });

  it('should execute decorators after message handling', () => {
    let afterHandle = [
      result => Object.assign({}, {order: result.order + '|first|'}),
      result => Object.assign({}, {order: result.order + '|second|'})
    ];
    let bus = new MessageBus({afterHandle});
    bus.register('MyMessage', () => Promise.resolve({order: '|initial|'}));

    let broadcast = bus.broadcast({type: 'MyMessage'});

    return broadcast.then(([result]) => {
      result.should.deep.equal({
        order: '|initial||first||second|'
      });
    });
  });
});
