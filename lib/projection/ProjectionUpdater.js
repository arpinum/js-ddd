'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {executePromiseInBatch} = require('../tools').stream;
const {Logger, promising, QueueManager, validate} = require('../tools');

class ProjectionUpdater {

  constructor(eventStore, projectionTracker, options) {
    validate(this).isA(t.struct({
      projectionName: t.String
    }));

    this._eventStore = eventStore;
    this._projectionTracker = projectionTracker;
    this._options = _.defaults({}, options, {log: new Logger({fileName: __filename})});
    this._queueManager = new QueueManager();
  }

  registerToBus(eventBus) {
    _.forEach(this.handlers, (handler, type) => {
      eventBus.register(type, () => this.ready());
    });
  }

  ready() {
    let self = this;
    return this._queueManager
      .queue(this.projectionName, {capacity: 2})
      .enqueue(() => update());

    function update() {
      self._options.log.debug('Update started');
      return retrieveLastEventId()
        .then(eventId => {
          let stream = self._eventStore.eventsFromTypes(eventTypes(), eventId);
          return executePromiseInBatch(stream, event => handleEvent(event));
        })
        .then(() => updateLastEventProcessed())
        .then(() => self._options.log.debug('Update done'))
        .catch(rejection => updateFailed(rejection));
    }

    function updateFailed(rejection) {
      return updateLastEventProcessed()
        .then(() => Promise.reject(rejection));
    }

    function eventTypes() {
      return _.keys(self.handlers);
    }

    function retrieveLastEventId() {
      if (!self._lastEventId) {
        return self._projectionTracker.getLastProcessedEventId(self.projectionName);
      }
      return Promise.resolve(self._lastEventId);
    }

    function handleEvent(event) {
      return promising.try(() => self.handlers[event.type](event))
        .then(() => {
          self._lastEventId = event.id;
        })
        .catch(rejection => {
          self._options.log.error(`Update failed on event ${event.id}`, rejection);
          return Promise.reject(rejection);
        });
    }

    function updateLastEventProcessed() {
      if (self._lastEventId) {
        return self._projectionTracker.updateLastProcessedEventId(self.projectionName, self._lastEventId);
      }
      return Promise.resolve();
    }
  }
}

module.exports = ProjectionUpdater;
