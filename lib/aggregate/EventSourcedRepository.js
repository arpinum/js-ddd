'use strict';

const _ = require('lodash');
const t = require('tcomb');
const TechnicalError = require('../errors').TechnicalError;
const LoggerFactory = require('../tools').LoggerFactory;
const EntityNotFoundError = require('../errors').EntityNotFoundError;
const {validate} = require('../tools');

class EventSourcedRepository {

  constructor(eventStore, eventBus, options) {
    validate(this).isA(t.struct({
      applyEvent: t.Function,
      AggregateType: t.Function
    }));

    this._options = _.defaults(options || {}, {
      log: new LoggerFactory().create(__filename),
    });
    this._eventStore = eventStore;
    this._eventBus = eventBus;
  }

  getById(id) {
    let aggregateType = this.AggregateType.name;
    let result = new this.AggregateType({id: id});
    let stream = this._eventStore.eventsFromAggregate(id, aggregateType);
    let eventCount = 0;
    return new Promise((resolve, reject) => {
      stream.on('data', event => {
        eventCount++;
        this.applyEvent(event, result);
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
  }

  saveEvents(events) {
    return this._eventStore.addAll(events)
      .then(() => ({broadcasts: this._eventBus.broadcastAll(events)}));
  }
}

module.exports = EventSourcedRepository;
