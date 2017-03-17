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
    log: t.maybe(LoggerContract),
    incomingEventConverters: t.maybe(t.list(t.Function)),
    outcomingEventConverters: t.maybe(t.list(t.Function))
  }))
}, {strict: true});

class Repository {

  constructor(creation) {
    let {eventStore, eventBus, AggregateRootType, options} = Creation(creation);
    this._eventStore = eventStore;
    this._eventBus = eventBus;
    this._AggregateRootType = AggregateRootType;
    this._options = _.defaults({}, options, {
      log: new Logger({fileName: __filename}),
      incomingEventConverters: [],
      outcomingEventConverters: []
    });
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
        let convertedEvent = convertEvent(event);
        return aggregateRoot.applyEvent(convertedEvent);
      } catch (error) {
        self._options.log.error(`Error applying event ${event.type}`, error);
        reject(new TechnicalError('Event cannot be applied'));
        return null;
      }
    }

    function convertEvent(event) {
      return self._options.incomingEventConverters.reduce((result, converter) => converter(result), event);
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
    let self = this;
    return storeEvents()
      .then(() => ({broadcasts: this._eventBus.broadcastAll(events)}));

    function storeEvents() {
      let convertedEvents = events.map(convertEvent);
      return self._eventStore.addAll(convertedEvents);
    }

    function convertEvent(event) {
      return self._options.outcomingEventConverters.reduce((result, converter) => converter(result), event);
    }
  }
}

module.exports = Repository;
