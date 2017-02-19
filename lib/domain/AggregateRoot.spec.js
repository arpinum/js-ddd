'use strict';

const {Message} = require('../tools');
const AggregateRoot = require('./AggregateRoot');
const {TypedAggregateRoot} = require('../types');

describe('The aggregate root', () => {

  class MyRoot extends AggregateRoot {
    constructor({id}) {
      super({
        id,
        aggregateName: 'MyRoot',
        handlers: {}
      });
    }
  }

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new MyRoot({id: 'the_id'});
  });

  context('after creation', () => {
    it('should match TypedAggregateRoot', () => {
      let aggregateRoot = new AggregateRoot({
        id: 'the_id',
        aggregateName: 'MyRoot',
        handlers: {}
      });

      TypedAggregateRoot.is(aggregateRoot).should.be.true;
    });
  });

  context('while creating event', () => {
    it('should use type and payload', () => {
      let event = aggregateRoot.createEvent({type: 'Event', payload: {name: 'the event'}});

      event.payload.should.deep.equal({name: 'the event'});
    });

    it('should concern the corresponding aggregate', () => {
      let event = aggregateRoot.createEvent(new Message({type: 'Event', payload: {name: 'the event'}}));

      event.aggregate.should.deep.equal({
        id: 'the_id',
        type: 'MyRoot'
      });
    });
  });

  context('while applying events', () => {
    it('should return vanilla object if event is unknown', () => {
      let result = aggregateRoot.applyEvent(new Message({type: 'Unknown'}));

      result.should.equal(aggregateRoot);
    });
  });
});
