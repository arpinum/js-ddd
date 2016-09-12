'use strict';

const FunctionalError = require('../errors').FunctionalError;
const Event = require('../messaging').Event;
const AggregateRoot = require('./AggregateRoot');

describe('The aggregate root', () => {

  class MyRoot extends AggregateRoot {
  }

  let aggregateRoot;

  beforeEach(() => {
    aggregateRoot = new MyRoot({id: 'the id'});
  });

  it('wont allow to be created without id', () => {
    (() => new MyRoot()).should.throw(FunctionalError, 'Entity must have an id');
  });

  it('should store additional information', () => {
    let root = new MyRoot({id: 'the id', name: 'toto'});

    root.should.deep.equal({id: 'the id', name: 'toto'});
  });

  it('should create an event from type and payload', () => {
    let event = aggregateRoot.createEvent('event', {name: 'the event'});

    event.payload.should.deep.equal({name: 'the event'});
  });

  it('should create an event concerning the aggregate', () => {
    let event = aggregateRoot.createEvent(new Event('event', {name: 'the event'}));

    event.aggregateRoot.should.deep.equal({
      id: 'the id',
      type: 'MyRoot'
    });
  });
});
