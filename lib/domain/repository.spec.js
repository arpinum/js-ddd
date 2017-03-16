'use strict';

const {Event, EventBus} = require('../tools');
const {EntityNotFoundError, TechnicalError} = require('../errors');
const {MemoryEventStore} = require('../test');
const {RepositoryContract} = require('../types');
const Cat = require('./test/cat');
const CatRepository = require('./test/catRepository');
const Repository = require('./repository');

describe('The repository', () => {

  let eventBus;
  let eventStore;
  let repository;

  beforeEach(() => {
    eventBus = new EventBus();
    eventStore = new MemoryEventStore();
    repository = new CatRepository({eventBus, eventStore});
  });

  context('after creation', () => {
    it('should match RepositoryContract', () => {
      let repository = new Repository({
        eventStore,
        eventBus,
        AggregateRootType: Cat
      });

      RepositoryContract.is(repository).should.be.true;
    });
  });

  context('while getting by id', () => {
    it('should apply all aggregate root\'s events', () => {
      eventStore.events.push(
        new Event({id: '1', type: 'CatCreated', aggregate: {type: 'Cat', id: '42'}, payload: {age: 1}}),
        new Event({id: '2', type: 'StuffOccurred', aggregate: {type: 'Dog', id: 'dog_id'}, payload: {name: 'Wulfy'}}),
        new Event({id: '3', type: 'CatNamed', aggregate: {type: 'Cat', id: '42'}, payload: {name: 'Garfield'}}),
        new Event({id: '4', type: 'CatNamed', aggregate: {type: 'Cat', id: 'another_id'}, payload: {name: 'Isidor'}})
      );

      let getById = repository.getById('42');

      return getById.then(cat => {
        cat.should.include({id: '42', name: 'Garfield', age: 1});
      });
    });

    it('should fail if event cannot be applied', () => {
      eventStore.events.push(
        new Event({id: '1', type: 'FailingEvent', aggregate: {type: 'Cat', id: '42'}})
      );

      let getById = repository.getById('42');

      return getById.should.be.rejectedWith(TechnicalError, 'Event cannot be applied');
    });

    it('should fail if root is missing', () => {
      let getById = repository.getById('missing_id');

      return getById.should.be.rejectedWith(EntityNotFoundError, 'No entity for {"id":"missing_id"}');
    });

    it('won\'t fail if root may be missing', () => {
      let getById = repository.getById('missing_id', {maybeMissing: true});

      return getById.should.eventually.be.undefined;
    });

    it('should use event converters if provided before applying an event', () => {
      eventStore.events.push(
        new Event({
          id: '1',
          type: 'CatCreated',
          aggregate: {type: 'Cat', id: '42'},
          payload: {age: 1}
        }));
      eventStore.events.push(
        new Event({
          id: '2',
          type: 'CatBirthdateDefined',
          aggregate: {type: 'Cat', id: '42'},
          payload: {birthDate: '2010-01-01'}
        })
      );

      let getById = repository.getById('42');

      return getById.then(cat => {
        cat.birthDate.should.deep.equal(new Date('2010-01-01'));
      });
    });
  });

  context('while saving events', () => {
    it('should store all events', () => {
      let events = [new Event({type: 'CatCreated'}), new Event({type: 'CatNamed'})];

      let save = repository.saveEvents(events);

      return save.then(() => {
        eventStore.events.length.should.equal(2);
        eventStore.events[0].type.should.equal('CatCreated');
        eventStore.events[1].type.should.equal('CatNamed');
      });
    });

    it('should broadcast all events after having store events', () => {
      let events = [new Event({type: 'CatCreated'}), new Event({type: 'CatNamed'})];
      let broadcasts = [];
      eventBus.register('CatCreated', () => {
        broadcasts.push('CatCreated');
      });
      eventBus.register('CatNamed', () => {
        broadcasts.push('CatNamed');
      });

      let save = repository.saveEvents(events);

      return save.then(result => {
        return result.broadcasts.then(() => {
          broadcasts.should.deep.equal(['CatCreated', 'CatNamed']);
        });
      });
    });
  });
});
