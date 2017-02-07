'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {EntityNotFoundError} = require('../../errors');
const {createLogger} = require('@arpinum/log');

const Dependencies = t.struct({
  eventStore: t.Object,
  eventBus: t.Object,
  AggregateType: t.Function,
  options: t.maybe(t.Object)
}, {strict: true});

function Repository(dependencies) {
  let {eventStore, eventBus, AggregateType, options:rawOptions} = Dependencies(dependencies);

  let options = Object.assign({}, rawOptions, {
    log: createLogger({fileName: __filename})
  });

  return {
    getById,
    saveEvents
  };

  function getById(id, getOptions) {
    let getByIdOptions = _.defaults({}, getOptions, {maybeMissing: false});
    let aggregateType = AggregateType.name;
    let result = new AggregateType(id);
    let stream = eventStore.eventsFromAggregate(id, aggregateType);
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
      options.log.debug(`Applying ${event.type} on ${event.aggregate.id}`);
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

  function saveEvents(events) {
    return eventStore.addAll(events)
      .then(() => ({broadcasts: eventBus.broadcastAll(events)}));
  }
}

module.exports = Repository;
