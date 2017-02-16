'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {EntityNotFoundError} = require('../errors');
const {Logger} = require('@arpinum/log');

function Factory(creation) {
  let {eventStore, eventBus, AggregateRootFactory, options:rawOptions} = creation;

  let options = Object.assign({}, rawOptions, {
    log: Logger({fileName: __filename})
  });

  return {
    getById,
    saveEvents
  };

  function getById(id, getOptions) {
    let getByIdOptions = _.defaults({}, getOptions, {maybeMissing: false});
    let result = AggregateRootFactory({id});
    let stream = eventStore.eventsFromAggregate(id, result.aggregateName);
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
      options.log.debug(`Applying ${event.type} on ${event.aggregate.id}`);
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

  function saveEvents(events) {
    return eventStore.addAll(events)
      .then(() => ({broadcasts: eventBus.broadcastAll(events)}));
  }
}

const Creation = t.interface({
  eventStore: t.Object,
  eventBus: t.Object,
  AggregateRootFactory: t.Function,
  options: t.maybe(t.Object)
});

const Repository = t.interface({
  getById: t.Function,
  saveEvents: t.Function
});

module.exports = t.func(Creation, Repository).of(Factory);
