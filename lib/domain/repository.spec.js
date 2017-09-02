'use strict';

const should = require('chai').should();
const {EntityNotFoundError, TechnicalError} = require('../errors');
const {MemoryEventStore} = require('../test');
const {RepositoryContract} = require('../types');
const Cat = require('./test/cat');
const CatRepository = require('./test/catRepository');
const Repository = require('./repository');

describe('The repository', () => {

  let eventStore;
  let repository;

  beforeEach(() => {
    eventStore = new MemoryEventStore();
    repository = new CatRepository({eventStore});
  });

  context('after creation', () => {
    it('should match RepositoryContract', () => {
      let repository = new Repository({
        eventStore,
        AggregateRootType: Cat
      });

      RepositoryContract.is(repository).should.be.true;
    });
  });

  context('while getting by id', () => {
    it('should apply all aggregate root\'s events', () => {
      eventStore.events.push(
        {id: '1', type: 'CatCreated', aggregate: {type: 'Cat', id: '42'}, payload: {age: 1}},
        {id: '2', type: 'StuffOccurred', aggregate: {type: 'Dog', id: 'dog_id'}, payload: {name: 'Wulfy'}},
        {id: '3', type: 'CatNamed', aggregate: {type: 'Cat', id: '42'}, payload: {name: 'Garfield'}},
        {id: '4', type: 'CatNamed', aggregate: {type: 'Cat', id: 'another_id'}, payload: {name: 'Isidor'}}
      );

      let getById = repository.getById('42');

      return getById.then(cat => {
        cat.should.include({id: '42', name: 'Garfield', age: 1});
      });
    });

    it('should fail if event cannot be applied', () => {
      eventStore.events.push(
        {id: '1', type: 'FailingEvent', aggregate: {type: 'Cat', id: '42'}}
      );

      let getById = repository.getById('42');

      return getById.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => {
          rejection.should.be.instanceOf(TechnicalError);
          rejection.message.should.equal('Event cannot be applied');
        });
    });

    it('should fail if root is missing', () => {
      let getById = repository.getById('missing_id');

      return getById.then(
        () => Promise.reject(new Error('Should fail')),
        rejection => {
          rejection.should.be.instanceOf(EntityNotFoundError);
          rejection.message.should.equal('No entity for {"id":"missing_id"}');
        });
    });

    it('won\'t fail if root may be missing', () => {
      let getById = repository.getById('missing_id', {maybeMissing: true});

      return getById.then(result => {
        should.not.exist(result);
      });
    });

    it('should use decorators if provided before applying an event', () => {
      eventStore.events.push(
        {
          id: '1',
          type: 'CatCreated',
          aggregate: {type: 'Cat', id: '42'},
          payload: {age: 1}
        });
      eventStore.events.push(
        {
          id: '2',
          type: 'CatBirthdateDefined',
          aggregate: {type: 'Cat', id: '42'},
          payload: {birthDate: '2010-01-01'}
        }
      );

      let getById = repository.getById('42');

      return getById.then(cat => {
        cat.birthDate.should.deep.equal(new Date('2010-01-01'));
      });
    });
  });
});
