'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {EntityNotFoundError} = require('../../errors');
const {validate} = require('../../tools');
const {createLogger} = require('@arpinum/log');

const Dependencies = t.struct({
  eventStore: t.Object,
  eventBus: t.Object,
  options: t.maybe(t.Object)
}, {strict: true});

class EventSourcedRepository {

  constructor(dependencies) {
    let {eventStore, eventBus, options} = Dependencies(dependencies);

    validate(this).isA(t.struct({
      AggregateType: t.Function
    }));

    this._options = _.defaults({}, options, {
      log: createLogger({fileName: __filename})
    });
    this._eventStore = eventStore;
    this._eventBus = eventBus;
    this._handlers = this.handlers;
  }

  getById(id, options) {
    let getByIdOptions = _.defaults({}, options, {maybeMissing: false});
    let self = this;
    let aggregateType = this.AggregateType.name;
    let result = new this.AggregateType(id);
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
        if (eventCount === 0) {
          handleMissing(resolve, reject);
        } else {
          resolve(result);
        }
      });
    });

    function applyEvent(event, aggregateRoot) {
      self._options.log.debug(`Applying ${event.type} on ${event.aggregate.id}`);
      aggregateRoot.applyEvent(event);
    }

    function handleMissing(resolve, reject) {
      if (!getByIdOptions.maybeMissing) {
        reject(new EntityNotFoundError({id}));
      } else {
        resolve();
      }
    }
  }

  saveEvents(events) {
    return this._eventStore.addAll(events)
      .then(() => ({broadcasts: this._eventBus.broadcastAll(events)}));
  }
}

module.exports = EventSourcedRepository;
