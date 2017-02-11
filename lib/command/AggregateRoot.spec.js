'use strict';

const Event = require('./event/Event');
const AggregateRoot = require('./AggregateRoot');

describe('The aggregate root', () => {

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = MyRoot({id: 'the_id'});
  });

  context('while being created', () => {
    it('should allow specific properties', () => {
      let root = AggregateRoot({
        id: '42',
        aggregateName: 'MyRoot',
        handlers: {},
        other: 'property'
      });

      root.id.should.equal('42');
      root.other.should.equal('property');
    });
  });

  context('while creating event', () => {
    it('should use type and payload', () => {
      let event = aggregateRoot.createEvent('Event', {name: 'the event'});

      event.payload.should.deep.equal({name: 'the event'});
    });

    it('should concern the corresponding aggregate', () => {
      let event = aggregateRoot.createEvent(new Event('Event', {name: 'the event'}));

      event.aggregate.should.deep.equal({
        id: 'the_id',
        type: 'MyRoot'
      });
    });
  });

  context('while applying events', () => {
    it('should return vanilla object if event is unknown', () => {
      let result = aggregateRoot.applyEvent(new Event('Unknown'));

      result.should.equal(aggregateRoot);
    });
  });

  function MyRoot(creation) {
    return AggregateRoot(Object.assign({
      aggregateName: 'MyRoot',
      handlers: {}
    }, creation));
  }
});
