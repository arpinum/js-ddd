'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const t = require('tcomb');
const {TechnicalError} = require('../errors');
const {executePromiseInBatch} = require('../tools').stream;
const {LoggerFactory, QueueManager, validate} = require('../tools');

class ProjectionUpdater {

  constructor(eventStore, projectionStore, options) {
    validate(this).isA(t.struct({
      projectionName: t.String
    }));

    this._eventStore = eventStore;
    this._projectionStore = projectionStore;
    this._options = _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
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
      return Bluebird.delay(this._options.delayBeforeUpdateInMs)
        .then(() => {
          delete this._readyPlanned;
          return this.ready();
        });
    }
    return Promise.resolve();
  }

  ready() {
    return this._queueManager
      .queue(this.projectionName, {limit: 1})
      .enqueue(() => this._update());
  }

  _update() {
    this._options.log.debug('Update started');
    return this._retrieveLastEventId()
      .then(eventId => {
        let stream = this._eventStore.eventsFromTypes(this._eventTypes(), eventId);
        return executePromiseInBatch(stream, event => this._handleEvent(event));
      })
      .then(() => this._options.log.debug('Update done'));
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
    return Bluebird.try(() => this.handlers[event.type](event))
      .then(() => this._newEventProcessed(event))
      .catch(rejection => {
        this._options.log.error(`Update failed on event ${event.id}`, rejection);
        return Promise.reject(rejection);
      });
  }

  _newEventProcessed(event) {
    this._lastEventId = event.id;
    return this._projectionStore.set(this.projectionName, {lastEventId: this._lastEventId});
  }
}

module.exports = ProjectionUpdater;
