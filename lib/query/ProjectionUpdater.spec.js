'use strict';

const sinon = require('sinon');
const {MemoryObjectStore, stream} = require('../tools');
const {EventBus, MemoryEventStore} = require('../command');
const ProjectionUpdater = require('./ProjectionUpdater');

describe('The projection updater', () => {

  let eventStore;
  let projectionStore;
  let updater;

  class MyUpdater extends ProjectionUpdater {
    constructor(eventStore, projectionStore, options) {
      super(eventStore, projectionStore, options);
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
    let options = {delayBeforeUpdateInMs: 0};
    eventStore = new MemoryEventStore();
    projectionStore = new MemoryObjectStore();
    updater = new MyUpdater(eventStore, projectionStore, options);
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

  it('wont trigger multiple updates at the same time', () => {
    let eventBus = new EventBus();
    updater.registerToBus(eventBus);
    eventStore.eventsFromTypes = sinon.stub().returns(stream.createArrayStream([]));

    let broadcasts = Promise.all([
      eventBus.broadcast('somethingHappened'),
      eventBus.broadcast('stuffOccurred')
    ]);

    return broadcasts.then(() => {
      eventStore.eventsFromTypes.should.have.been.calledOnce;
    });
  });
});
