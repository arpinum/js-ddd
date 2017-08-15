'use strict';

const {Message} = require('@arpinum/messaging');
const {EventBus} = require('../../tools');
const broadcastEventsDecorator = require('./broadcastEventsDecorator');

describe('Broadcast events decorator', () => {

  let eventBus;
  let decorator;

  beforeEach(() => {
    eventBus = new EventBus({log: () => undefined});
    decorator = broadcastEventsDecorator({eventBus});
  });

  it('should broadcast resulting events', () => {
    let events = [new Message({type: 'CatCreated'}), new Message({type: 'CatNamed'})];
    let broadcasts = [];
    eventBus.register('CatCreated', () => {
      broadcasts.push('CatCreated');
    });
    eventBus.register('CatNamed', () => {
      broadcasts.push('CatNamed');
    });

    let decoration = decorator({events});

    return decoration.then(() => {
      broadcasts.should.deep.equal(['CatCreated', 'CatNamed']);
    });
  });

  it('should return result as it', () => {
    let events = [new Message({type: 'CatCreated'})];

    let decoration = decorator({events});

    return decoration.then(result => {
      result.should.deep.equal({events});
    });
  });
});
