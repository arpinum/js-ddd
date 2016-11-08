'use strict';

const {EventBus, MemoryEventStore} = require('../command');
const MemoryProjectionTracker = require('./MemoryProjectionTracker');
const ProjectionUpdater = require('./ProjectionUpdater');

describe('The projection updater', () => {

  let eventStore;
  let projectionTracker;
  let updater;

  class MyUpdater extends ProjectionUpdater {
    constructor(eventStore, projectionTracker, options) {
      super(eventStore, projectionTracker, options);
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
  }

  beforeEach(() => {
    eventStore = new MemoryEventStore();
    projectionTracker = new MemoryProjectionTracker();
    updater = new MyUpdater(eventStore, projectionTracker);
  });

  it('should have a projection name ', () => {
    let act = () => new ProjectionUpdater().projectionName;

    act.should.throw(Error);
  });

  it('should apply relevant events on ready', () => {
    eventStore.events = [
      {id: '1', type: 'somethingHappened'},
      {id: '2', type: 'iDoNotCare'},
      {id: '3', type: 'stuffOccurred'}
    ];

    let ready = updater.ready();

    return ready.then(() => {
      updater.handlings.should.deep.equal([
        {type: 'somethingHappened', event: {id: '1', type: 'somethingHappened'}},
        {type: 'stuffOccurred', event: {id: '3', type: 'stuffOccurred'}}
      ]);
    });
  });

  context('after having applied an event', () => {
    beforeEach(() => {
      eventStore.events = [
        {id: '1', type: 'somethingHappened'}
      ];
      return updater.ready();
    });

    it('should only apply newer events on ready', () => {
      updater.handlings = [];
      eventStore.events = [
        {id: '1', type: 'somethingHappened'},
        {id: '2', type: 'stuffOccurred'}
      ];

      let ready = updater.ready();

      return ready.then(() => {
        updater.handlings.should.deep.equal([
          {type: 'stuffOccurred', event: {id: '2', type: 'stuffOccurred'}}
        ]);
      });
    });
  });

  it('should allow event bus registration to trigger updates when relevant events are broadcasted', () => {
    let eventBus = new EventBus();
    eventStore.events = [
      {id: '1', type: 'somethingHappened'},
      {id: '2', type: 'stuffOccurred'}
    ];
    updater.registerToBus(eventBus);

    let broadcast = eventBus.broadcast('somethingHappened');

    return broadcast.then(() => {
      updater.handlings.should.deep.equal([
        {type: 'somethingHappened', event: {id: '1', type: 'somethingHappened'}},
        {type: 'stuffOccurred', event: {id: '2', type: 'stuffOccurred'}}
      ]);
    });
  });
});
