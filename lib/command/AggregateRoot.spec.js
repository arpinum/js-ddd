'use strict';

const Event = require('./event/Event');
const AggregateRoot = require('./AggregateRoot');

describe('The aggregate root', () => {

  class MyRoot extends AggregateRoot {

    get handlers() {
      return {};
    }
  }

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new MyRoot('the_id');
  });

  it('should create an event from type and payload', () => {
    let event = aggregateRoot.createEvent('event', {name: 'the event'});

    event.payload.should.deep.equal({name: 'the event'});
  });

  it('should create an event concerning the aggregate', () => {
    let event = aggregateRoot.createEvent(new Event('event', {name: 'the event'}));

    event.aggregate.should.deep.equal({
      id: 'the_id',
      type: 'MyRoot'
    });
  });
});
