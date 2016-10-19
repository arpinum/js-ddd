'use strict';

const MemoryEventStore = require('./MemoryEventStore');
const EventBus = require('./EventBus');
const Event = require('./Event');
const AggregateRoot = require('./../AggregateRoot');
const EventSourcedRepository = require('./EventSourcedRepository');

describe('The event sourced repository', () => {

  class Cat extends AggregateRoot {
    get handlers() {
      return {
        catCreated: (event, cat) => Object.assign(cat, event.payload),
        catNamed: (event, cat) => Object.assign(cat, {name: event.payload.name})
      };
    }
  }

  class CatRepository extends EventSourcedRepository {

    constructor(eventStore, eventBus) {
      super(eventStore, eventBus);
    }

    get AggregateType() {
      return Cat;
    }
  }

  let eventBus;
  let eventStore;
  let repository;

  beforeEach(() => {
    eventBus = new EventBus();
    eventStore = new MemoryEventStore();
    repository = new CatRepository(eventStore, eventBus);
  });

  it('should have an aggregate type', () => {
    let act = () => new EventSourcedRepository().AggregateType;

    act.should.throw(Error);
  });

  it('should get by id by applying all aggregate root\'s events', () => {
    eventStore.events = [
      {id: '1', type: 'catCreated', aggregate: {type: 'Cat', id: 'the_id'}, payload: {age: 1}},
      {id: '2', type: 'stuffOccurred', aggregate: {type: 'Dog', id: 'dog_id'}, payload: {name: 'Wulfy'}},
      {id: '3', type: 'catNamed', aggregate: {type: 'Cat', id: 'the_id'}, payload: {name: 'Garfield'}},
      {id: '4', type: 'catNamed', aggregate: {type: 'Cat', id: 'another_id'}, payload: {name: 'Isidor'}}
    ];

    let getById = repository.getById('the_id');

    return getById.then(cat => {
      cat.should.deep.equal({id: 'the_id', name: 'Garfield', age: 1});
    });
  });

  it('should save by storing all events', () => {
    let events = [new Event('catCreated'), new Event('catNamed')];

    let save = repository.saveEvents(events);

    return save.then(() => {
      eventStore.events.length.should.equal(2);
      eventStore.events[0].type.should.equal('catCreated');
      eventStore.events[1].type.should.equal('catNamed');
    });
  });

  it('should broadcast all events after having saved an aggregate root', () => {
    let events = [new Event('catCreated'), new Event('catNamed')];
    let broadcasts = [];
    eventBus.register('catCreated', () => {
      broadcasts.push('catCreated');
    });
    eventBus.register('catNamed', () => {
      broadcasts.push('catNamed');
    });

    let save = repository.saveEvents(events);

    return save.then(result => {
      return result.broadcasts.then(() => {
        broadcasts.should.deep.equal(['catCreated', 'catNamed']);
      });
    });
  });
});
