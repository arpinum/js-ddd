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
        somethingHappened: event => {
          this.handlings.push({type: 'somethingHappened', event});
          return Promise.resolve();
        },
        stuffOccurred: event => {
          this.handlings.push({type: 'stuffOccurred', event});
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
        {id: '1', type: 'somethingHappened'},
        {id: '2', type: 'iDoNotCare'},
        {id: '3', type: 'stuffOccurred'}
      ];

      let ready = updater.build();

      return ready.then(() => {
        updater.handlings.should.deep.equal([
          {type: 'somethingHappened', event: {id: '1', type: 'somethingHappened'}},
          {type: 'stuffOccurred', event: {id: '3', type: 'stuffOccurred'}}
        ]);
      });
    });

    it('wont apply events if is not empty', () => {
      updater.isEmptyValue = false;
      eventStore.events = [
        {id: '1', type: 'somethingHappened'}
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

      let broadcast = eventBus.broadcast('somethingHappened', {the: 'payload'});

      return broadcast.then(() => {
        updater.handlings.should.deep.equal([
          {type: 'somethingHappened', event: {type: 'somethingHappened', payload: {the: 'payload'}}}
        ]);
      });
    });

    it('may handle event synchronically', () => {
      let eventBus = new EventBus();
      updater.handlers = {
        somethingHappened: event => {
          updater.handlings.push('somethingHappened');
        }
      };
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('somethingHappened', {the: 'payload'});

      return broadcast.then(() => {
        updater.handlings.should.deep.equal(['somethingHappened']);
      });
    });

    it('won\'t handle irrelevant events', () => {
      let eventBus = new EventBus();
      updater.registerToBus(eventBus);

      let broadcast = eventBus.broadcast('iDoNotCare', {the: 'payload'});

      return broadcast.then(() => {
        updater.handlings.should.be.empty;
      });
    });
  });
});
