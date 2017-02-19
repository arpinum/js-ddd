'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {object} = require('../tools');
const {EntityNotFoundError} = require('../errors');
const {TypedEventStore, TypedMessageBus} = require('../types');
const {Logger, TypedLogger} = require('@arpinum/log');

const Creation = t.interface({
  eventStore: TypedEventStore,
  eventBus: TypedMessageBus,
  AggregateRootType: t.Function,
  options: t.maybe(t.interface({
    log: t.maybe(TypedLogger)
  }))
}, {strict: true});

class Repository {

  constructor(creation) {
    let {eventStore, eventBus, AggregateRootType, options} = Creation(creation);
    object.assignPrivately(this, {
      _eventStore: eventStore,
      _eventBus: eventBus,
      _AggregateRootType: AggregateRootType,
      _options: Object.assign({}, {
        log: new Logger({fileName: __filename})
      }, options)
    });
  }

  getById(id, options) {
    let self = this;
    let getByIdOptions = _.defaults({}, options, {maybeMissing: false});
    let result = new this._AggregateRootType({id});
    let stream = this._eventStore.eventsFromAggregate(id, result.aggregateName);
    let eventCount = 0;
    return new Promise((resolve, reject) => {
      stream.on('data', event => {
        eventCount++;
        result = applyEvent(event, result);
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
      return aggregateRoot.applyEvent(event);
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

module.exports = {Repository};
