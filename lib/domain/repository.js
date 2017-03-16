'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {EntityNotFoundError, TechnicalError} = require('../errors');
const {EventStoreContract, MessageBusContract} = require('../types');
const {Logger, LoggerContract} = require('@arpinum/log');
const AggregateRoot = require('./aggregateRoot');

const Creation = t.interface({
  eventStore: EventStoreContract,
  eventBus: MessageBusContract,
  AggregateRootType: t.Function,
  options: t.maybe(t.interface({
    log: t.maybe(LoggerContract)
  }))
}, {strict: true});

class Repository {

  constructor(creation) {
    let {eventStore, eventBus, AggregateRootType, options} = Creation(creation);
    this._eventStore = eventStore;
    this._eventBus = eventBus;
    this._AggregateRootType = AggregateRootType;
    this._options = Object.assign({}, {
      log: new Logger({fileName: __filename})
    }, options);
  }

  getById(id, options) {
    let self = this;
    let getByIdOptions = _.defaults({}, options, {maybeMissing: false});
    let result = AggregateRoot.bootstrap({type: this._AggregateRootType, id});
    let stream = this._eventStore.eventsFromAggregate(id, result.aggregateName);
    let eventCount = 0;
    return new Promise((resolve, reject) => {
      stream.on('data', event => {
        eventCount++;
        result = applyEvent(event, result, reject);
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

    function applyEvent(event, aggregateRoot, reject) {
      try {
        self._options.log.debug(`Applying ${event.type} on ${event.aggregate.id}`);
        return aggregateRoot.applyEvent(event);
      } catch (error) {
        reject(new TechnicalError('Event cannot be applied'));
        return null;
      }
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

module.exports = Repository;
