'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {EntityNotFoundError, TechnicalError} = require('../../errors');
const {LoggerFactory, validate} = require('../../tools');

class EventSourcedRepository {

  constructor(eventStore, eventBus, options) {
    validate(this).isA(t.struct({
      handlers: t.Object,
      AggregateType: t.Function
    }));

    this._options = _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
    });
    this._eventStore = eventStore;
    this._eventBus = eventBus;
    this._handlers = this.handlers;
  }

  getById(id) {
    let self = this;
    let aggregateType = this.AggregateType.name;
    let result = new this.AggregateType({id: id});
    let stream = this._eventStore.eventsFromAggregate(id, aggregateType);
    let eventCount = 0;
    return new Promise((resolve, reject) => {
      stream.on('data', event => {
        eventCount++;
        applyEvent(event, result);
      });
      stream.on('error', error => {
        reject(error);
      });
      stream.once('end', () => {
        if (eventCount === 0 || result.deleted) {
          reject(new EntityNotFoundError({id: id}));
        }
        resolve(result);
      });
    });

    function applyEvent(event, aggregateRoot) {
      self._options.log.debug(`Applying ${event.type} on ${event.aggregateRoot.id}`);
      let handler = self._handlers[event.type] || (() => undefined);
      handler(event, aggregateRoot);
    }
  }

  saveEvents(events) {
    return this._eventStore.addAll(events)
      .then(() => ({broadcasts: this._eventBus.broadcastAll(events)}));
  }
}

module.exports = EventSourcedRepository;
