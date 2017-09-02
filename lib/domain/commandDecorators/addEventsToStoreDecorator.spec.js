'use strict';

const {MemoryEventStore} = require('../../test');
const addEventsToStoreDecorator = require('./addEventsToStoreDecorator');

describe('Add events to store decorator', () => {

  let eventStore;
  let decorator;

  beforeEach(() => {
    eventStore = new MemoryEventStore();
    decorator = addEventsToStoreDecorator({eventStore});
  });

  it('should save resulting events', () => {
    let events = [{type: 'CatCreated'}, {type: 'CatNamed'}];

    let decoration = decorator({events});

    return decoration.then(() => {
      eventStore.events.length.should.equal(2);
      eventStore.events[0].type.should.equal('CatCreated');
      eventStore.events[1].type.should.equal('CatNamed');
    });
  });

  it('should return result as it', () => {
    let events = [{type: 'CatCreated'}];

    let decoration = decorator({events});

    return decoration.then(result => {
      result.should.deep.equal({events});
    });
  });
});
