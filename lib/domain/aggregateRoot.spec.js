'use strict';

const {Event} = require('../tools');
const {AggregateRootContract} = require('../types');
const Cat = require('./test/cat');
const AggregateRoot = require('./aggregateRoot');

describe('The aggregate root', () => {

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new Cat({id: '42', age: 1});
  });

  context('after creation', () => {
    it('should match AggregateRootContract', () => {
      AggregateRootContract.is(aggregateRoot).should.be.true;
    });

    it('should have aggregateName matching type', () => {
      aggregateRoot.aggregateName.should.equal('Cat');
    });
  });

  context('while bootstraping', () => {
    it('should create a typed and identified root', () => {
      let root = AggregateRoot.bootstrap({type: Cat, id: '42'});

      root.should.be.instanceOf(Cat);
      root.id.should.equal('42');
    });
  });

  context('while creating event', () => {
    it('should use type and payload', () => {
      let event = aggregateRoot.createEvent({type: 'Event', payload: {name: 'the event'}});

      event.payload.should.deep.equal({name: 'the event'});
    });

    it('should concern the corresponding aggregate', () => {
      let event = aggregateRoot.createEvent(new Event({type: 'Event', payload: {name: 'the event'}}));

      event.aggregate.should.deep.equal({
        id: '42',
        type: 'Cat'
      });
    });
  });

  context('while applying events', () => {
    it('should return vanilla object if event is unknown', () => {
      let result = aggregateRoot.applyEvent(new Event({type: 'Unknown'}));

      result.should.equal(aggregateRoot);
    });
  });

  context('while updating', () => {
    let updated;

    beforeEach(() => {
      updated = aggregateRoot.updateWith({name: 'woofy'});
    });

    it('should return a different instance', () => {
      updated.should.not.equal(aggregateRoot);
    });

    it('should return an updated instance', () => {
      updated.id.should.equal('42');
      updated.name.should.equal('woofy');
    });

    it('should keep the original type', () => {
      updated.constructor.name.should.equal('Cat');
    });
    it('should keep original properties', () => {
      let aggregateRoot = new Cat({id: '42', age: 10});

      updated = aggregateRoot.updateWith({name: 'woofy'});

      updated.age.should.equal(10);
    });
  });
});
