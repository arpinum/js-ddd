'use strict';

const {MemoryEventStore} = require('../command');
const {busFactory} = require('../tools');
const projectionUpdater = require('./projectionUpdater');

describe('The projection updater', () => {

  let eventStore;
  let eventBus;
  let updater;
  let handlings;

  beforeEach(() => {
    eventStore = new MemoryEventStore();
    eventBus = busFactory.createEventBus();
    handlings = [];
    updater = new createMyUpdater();
  });

  context('during build', () => {
    it('should apply relevant events if is empty', () => {
      updater.isEmptyValue = true;
      eventStore.events = [
        {id: '1', type: 'SomethingHappened'},
        {id: '2', type: 'IDoNotCare'},
        {id: '3', type: 'StuffOccurred'}
      ];

      let ready = updater.build();

      return ready.then(() => {
        handlings.should.deep.equal([
          {type: 'SomethingHappened', event: {id: '1', type: 'SomethingHappened'}},
          {type: 'StuffOccurred', event: {id: '3', type: 'StuffOccurred'}}
        ]);
      });
    });

    it('wont apply events if is not empty', () => {
      let updater = createMyUpdater({
        isEmpty: () => Promise.resolve(false)
      });
      eventStore.events = [
        {id: '1', type: 'SomethingHappened'}
      ];

      let ready = updater.build();

      return ready.then(() => {
        handlings.should.be.empty;
      });
    });
  });

  context('while listening to event bus', () => {
    it('should handle relevant events', () => {
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('SomethingHappened', {the: 'payload'});

      return broadcast.then(() => {
        handlings.should.deep.equal([
          {type: 'SomethingHappened', event: {type: 'SomethingHappened', payload: {the: 'payload'}}}
        ]);
      });
    });

    it('may handle event synchronically', () => {
      let updater = createMyUpdater({
        handlers: {
          SomethingHappened: () => {
            handlings.push('SomethingHappened');
          }
        }
      });
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('SomethingHappened', {the: 'payload'});

      return broadcast.then(() => {
        handlings.should.deep.equal(['SomethingHappened']);
      });
    });

    it('won\'t handle irrelevant events', () => {
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('IDoNotCare', {the: 'payload'});

      return broadcast.then(() => {
        handlings.should.be.empty;
      });
    });
  });

  function createMyUpdater(construction) {
    let implementation = {
      eventStore,
      handlers: {
        SomethingHappened: event => {
          handlings.push({type: 'SomethingHappened', event});
          return Promise.resolve();
        },
        StuffOccurred: event => {
          handlings.push({type: 'StuffOccurred', event});
          return Promise.resolve();
        }
      },
      isEmpty: () => Promise.resolve(true)
    };
    return projectionUpdater(Object.assign({}, implementation, construction));
  }
});
