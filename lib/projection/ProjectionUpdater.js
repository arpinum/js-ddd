'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {executePromiseInBatch} = require('../tools').stream;
const {Logger, promising, QueueManager, validate} = require('../tools');

class ProjectionUpdater {

  constructor(eventStore, projectionStore, options) {
    validate(this).isA(t.struct({
      projectionName: t.String
    }));

    this._eventStore = eventStore;
    this._projectionStore = projectionStore;
    this._options = _.defaults({}, options, {
      log: new Logger({fileName: __filename}),
      delayBeforeUpdateInMs: 500
    });
    this._queueManager = new QueueManager();
  }

  registerToBus(eventBus) {
    _.forEach(this._eventTypes(), type => {
      eventBus.register(type, () => this._planReady());
    });
  }

  _planReady() {
    if (!this._readyPlanned) {
      this._options.log.debug('Planning ready for', this.projectionName);
      this._readyPlanned = true;
      return promising.delay(this._options.delayBeforeUpdateInMs)
        .then(() => {
          delete this._readyPlanned;
          return this.ready();
        });
    }
    return Promise.resolve();
  }

  ready() {
    return this._queueManager
      .queue(this.projectionName, {capacity: 2})
      .enqueue(() => this._update());
  }

  _update() {
    this._options.log.debug('Update started');
    return this._retrieveLastEventId()
      .then(eventId => {
        let stream = this._eventStore.eventsFromTypes(this._eventTypes(), eventId);
        return executePromiseInBatch(stream, event => this._handleEvent(event));
      })
      .then(() => this._updateLastEventProcessed())
      .then(() => this._options.log.debug('Update done'))
      .catch(rejection => this._updateLastEventProcessed().then(() => Promise.reject(rejection)));
  }

  _eventTypes() {
    return _.keys(this.handlers);
  }

  _retrieveLastEventId() {
    if (!this._lastEventId) {
      return this._projectionStore.get(this.projectionName)
        .then(result => _.get(result, 'lastEventId', null));
    }
    return Promise.resolve(this._lastEventId);
  }

  _handleEvent(event) {
    return promising.try(() => this.handlers[event.type](event))
      .then(() => Object.assign(this, {_lastEventId: event.id}))
      .catch(rejection => {
        this._options.log.error(`Update failed on event ${event.id}`, rejection);
        return Promise.reject(rejection);
      });
  }

  _updateLastEventProcessed() {
    if (this._lastEventId) {
      return this._projectionStore.set(this.projectionName, {lastEventId: this._lastEventId});
    }
    return Promise.resolve();
  }

  informationFromCreationEvent(event) {
    return {_id: event.aggregate.id, creationDate: event.date};
  }
}

module.exports = ProjectionUpdater;
