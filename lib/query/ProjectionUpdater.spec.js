'use strict';

const {EventBus, MemoryEventStore} = require('../command');
const ProjectionUpdater = require('./ProjectionUpdater');

describe('The projection updater', () => {

  let eventStore;
  let updater;

  class MyUpdater extends ProjectionUpdater {
    constructor(dependencies) {
      super(dependencies);
      this.isEmptyValue = false;
      this.handlings = [];
      this.handlers = {
        SomethingHappened: event => {
          this.handlings.push({type: 'SomethingHappened', event});
          return Promise.resolve();
        },
        StuffOccurred: event => {
          this.handlings.push({type: 'StuffOccurred', event});
          return Promise.resolve();
        }
      };
    }

    get projectionName() {
      return 'myProjection';
    }

    isEmpty() {
      return Promise.resolve(this.isEmptyValue);
    }
  }

  beforeEach(() => {
    eventStore = new MemoryEventStore();
    updater = new MyUpdater({eventStore});
  });

  it('should have a projection name', () => {
    let act = () => new ProjectionUpdater().projectionName;

    act.should.throw(Error);
  });

  it('should tell if empty', () => {
    let act = () => new ProjectionUpdater().isEmpty();

    act.should.throw(Error);
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
        updater.handlings.should.deep.equal([
          {type: 'SomethingHappened', event: {id: '1', type: 'SomethingHappened'}},
          {type: 'StuffOccurred', event: {id: '3', type: 'StuffOccurred'}}
        ]);
      });
    });

    it('wont apply events if is not empty', () => {
      updater.isEmptyValue = false;
      eventStore.events = [
        {id: '1', type: 'SomethingHappened'}
      ];

      let ready = updater.build();

      return ready.then(() => {
        updater.handlings.should.be.empty;
      });
    });
  });

  context('while listening to event bus', () => {
    it('should handle relevant events', () => {
      let eventBus = new EventBus();
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('SomethingHappened', {the: 'payload'});

      return broadcast.then(() => {
        updater.handlings.should.deep.equal([
          {type: 'SomethingHappened', event: {type: 'SomethingHappened', payload: {the: 'payload'}}}
        ]);
      });
    });

    it('may handle event synchronically', () => {
      let eventBus = new EventBus();
      updater.handlers = {
        SomethingHappened: () => {
          updater.handlings.push('SomethingHappened');
        }
      };
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('SomethingHappened', {the: 'payload'});

      return broadcast.then(() => {
        updater.handlings.should.deep.equal(['SomethingHappened']);
      });
    });

    it('won\'t handle irrelevant events', () => {
      let eventBus = new EventBus();
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('IDoNotCare', {the: 'payload'});

      return broadcast.then(() => {
        updater.handlings.should.be.empty;
      });
    });
  });
});
