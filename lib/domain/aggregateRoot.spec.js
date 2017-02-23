'use strict';

const {Event} = require('../tools');
const {AggregateRootContract} = require('../types');
const AggregateRoot = require('./aggregateRoot');

describe('The aggregate root', () => {

  class Dog extends AggregateRoot {
  }

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new Dog({id: '42'});
  });

  context('after creation', () => {
    it('should match AggregateRootContract', () => {
      AggregateRootContract.is(aggregateRoot).should.be.true;
    });

    it('should have aggregateName matching type', () => {
      aggregateRoot.aggregateName.should.equal('Dog');
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
        type: 'Dog'
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
      updated.constructor.name.should.equal('Dog');
    });
  });
});
