'use strict';

const Event = require('./event/Event');
const AggregateRoot = require('./AggregateRoot');

describe('The aggregate root', () => {

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = MyRoot({id: 'the_id'});
  });

  it('should create an event from type and payload', () => {
    let event = aggregateRoot.createEvent('Event', {name: 'the event'});

    event.payload.should.deep.equal({name: 'the event'});
  });

  it('should create an event concerning the aggregate', () => {
    let event = aggregateRoot.createEvent(new Event('Event', {name: 'the event'}));

    event.aggregate.should.deep.equal({
      id: 'the_id',
      type: 'MyRoot'
    });
  });

  function MyRoot(construction) {
    return AggregateRoot(Object.assign({
      aggregateName: 'MyRoot',
      handlers: {}
    }, construction));
  }
});
