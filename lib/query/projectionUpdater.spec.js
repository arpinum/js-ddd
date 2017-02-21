'use strict';

const {MemoryEventStore} = require('../test');
const {EventBus} = require('../tools');
const ProjectionUpdater = require('./projectionUpdater');

describe('The projection updater', () => {

  let handlings;

  class MyUpdater extends ProjectionUpdater {

    constructor(creation) {
      super(Object.assign({
        handlers: handlers(),
        isEmpty: () => Promise.resolve(true)
      }, creation));

      function handlers() {
        return {
          SomethingHappened: event => {
            handlings.push({type: 'SomethingHappened', event});
            return Promise.resolve();
          },
          StuffOccurred: event => {
            handlings.push({type: 'StuffOccurred', event});
            return Promise.resolve();
          }
        };
      }
    }
  }

  let eventStore;
  let eventBus;
  let updater;

  beforeEach(() => {
    eventStore = new MemoryEventStore();
    eventBus = new EventBus();
    handlings = [];
    updater = new MyUpdater({eventStore});
  });

  context('during build', () => {
    it('should apply relevant events if is empty', () => {
      eventStore.events.push(
        {id: '1', type: 'SomethingHappened'},
        {id: '2', type: 'IDoNotCare'},
        {id: '3', type: 'StuffOccurred'}
      );

      let ready = updater.build();

      return ready.then(() => {
        handlings.should.deep.equal([
          {type: 'SomethingHappened', event: {id: '1', type: 'SomethingHappened'}},
          {type: 'StuffOccurred', event: {id: '3', type: 'StuffOccurred'}}
        ]);
      });
    });

    it('wont apply events if is not empty', () => {
      let updater = new MyUpdater({
        eventStore,
        isEmpty: () => Promise.resolve(false)
      });
      eventStore.events.push(
        {id: '1', type: 'SomethingHappened'}
      );

      let ready = updater.build();

      return ready.then(() => {
        handlings.should.be.empty;
      });
    });
  });

  context('while listening to event bus', () => {
    it('should handle relevant events', () => {
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast({type: 'SomethingHappened', payload: {the: 'payload'}});

      return broadcast.then(() => {
        handlings.should.deep.equal([
          {type: 'SomethingHappened', event: {type: 'SomethingHappened', payload: {the: 'payload'}}}
        ]);
      });
    });

    it('may handle event synchronically', () => {
      let updater = new MyUpdater({
        eventStore,
        handlers: {
          SomethingHappened: () => {
            handlings.push('SomethingHappened');
          }
        }
      });
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast({type: 'SomethingHappened', payload: {the: 'payload'}});

      return broadcast.then(() => {
        handlings.should.deep.equal(['SomethingHappened']);
      });
    });

    it('won\'t handle irrelevant events', () => {
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast({type: 'IDoNotCare', payload: {the: 'payload'}});

      return broadcast.then(() => {
        handlings.should.be.empty;
      });
    });
  });
});
