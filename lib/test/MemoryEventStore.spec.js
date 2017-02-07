'use strict';

const MemoryEventStore = require('./MemoryEventStore');

describe('The memory event store', () => {

  let eventStore;

  beforeEach(() => {
    eventStore = MemoryEventStore();
  });

  it('should add an event and set its id', () => {
    let add = eventStore.add({the: 'event'});

    return add.then(() => {
      eventStore.events.should.deep.equal([{id: 0, the: 'event'}]);
    });
  });

  it('should add multiple events', () => {
    let addAll = eventStore.addAll([{first: 'first event'}, {second: 'second event'}]);

    return addAll.then(() => {
      eventStore.events.should.deep.equal([{id: 0, first: 'first event'}, {id: 1, second: 'second event'}]);
    });
  });

  it('should find events from a aggregate', () => {
    eventStore.events.push(
      {id: 'event1', aggregate: {id: 'wrongAggregate', type: 'wrongType'}},
      {id: 'event2', aggregate: {id: 'rightAggregate', type: 'rightType'}},
      {id: 'event3', aggregate: {id: 'rightAggregate', type: 'wrongType'}},
      {id: 'event4', aggregate: {id: 'rightAggregate', type: 'rightType'}},
      {id: 'event5', aggregate: {id: 'wrongAggregate', type: 'wrongType'}}
    );

    let eventsFromAggregate = eventStore.eventsFromAggregate('rightAggregate', 'rightType');

    return arrayFromStream(eventsFromAggregate).then(results => {
      results.should.deep.equal([
        {id: 'event2', aggregate: {id: 'rightAggregate', type: 'rightType'}},
        {id: 'event4', aggregate: {id: 'rightAggregate', type: 'rightType'}}
      ]);
    });
  });

  it('should find events from types', () => {
    eventStore.events.push(
      {id: 'event1', type: 'type1'},
      {id: 'event2', type: 'type2'},
      {id: 'event3', type: 'type2'},
      {id: 'event4', type: 'type3'}
    );

    let eventsFromTypes = eventStore.eventsFromTypes(['type2', 'type3']);

    return arrayFromStream(eventsFromTypes).then(results => {
      results.should.deep.equal([
        {id: 'event2', type: 'type2'},
        {id: 'event3', type: 'type2'},
        {id: 'event4', type: 'type3'}
      ]);
    });
  });

  function arrayFromStream(stream) {
    return new Promise(resolve => {
      let elements = [];
      stream.on('data', element => elements.push(element));
      stream.once('end', () => resolve(elements));
    });
  }
});
