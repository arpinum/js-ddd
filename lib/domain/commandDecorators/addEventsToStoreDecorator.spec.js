'use strict';

const {Message} = require('../../tools');
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
    let events = [new Message({type: 'CatCreated'}), new Message({type: 'CatNamed'})];

    let decoration = decorator({events});

    return decoration.then(() => {
      eventStore.events.length.should.equal(2);
      eventStore.events[0].type.should.equal('CatCreated');
      eventStore.events[1].type.should.equal('CatNamed');
    });
  });

  it('should return result as it', () => {
    let events = [new Message({type: 'CatCreated'})];

    let decoration = decorator({events});

    return decoration.then(result => {
      result.should.deep.equal({events});
    });
  });
});
