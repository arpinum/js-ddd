'use strict';

const TechnicalError = require('../errors').TechnicalError;
const EntityNotFoundError = require('../errors').EntityNotFoundError;

class EventSourcedRepository {

  constructor(eventStore, eventBus) {
    this._eventStore = eventStore;
    this._eventBus = eventBus;
  }

  static get AggregateType() {
    throw new TechnicalError('Must be implemented');
  }

  getById(id) {
    let aggregateType = this.constructor.AggregateType.name;
    let result = new this.constructor.AggregateType({id: id});
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

  applyEvent() {
    throw new TechnicalError('Must be implemented');
  }

  saveEvents(events) {
    return this._eventStore.addAll(events)
      .then(() => {
        return {broadcasts: this._eventBus.broadcastAll(events)};
      });
  }
}

module.exports = EventSourcedRepository;
