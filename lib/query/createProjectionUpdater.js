'use strict';

const _ = require('lodash');
const t = require('tcomb');
const co = require('co');
const {promising} = require('../tools');
const {executePromiseInBatch} = require('../tools').stream;
const {createLogger} = require('@arpinum/log');

const Dependencies = t.struct({
  eventStore: t.Object,
  isEmpty: t.Function,
  handlers: t.Object,
  options: t.maybe(t.Object)
}, {strict: true});

function createProjectionUpdater(dependencies) {
  let {eventStore, isEmpty, handlers, options:rawOptions} = Dependencies(dependencies);
  let options = Object.assign({}, rawOptions, {log: createLogger({fileName: __filename})});
  return {
    build,
    registerToBus
  };

  function build() {
    return co(function *() {
      if (yield isEmpty()) {
        return buildFromEvents();
      }
      return Promise.resolve();
    });
  }

  function buildFromEvents() {
    return co(function *() {
      options.log.debug('Projection build started');
      let stream = eventStore.eventsFromTypes(eventTypes());
      yield executePromiseInBatch(stream, event => handleEvent(event));
      options.log.debug('Projection build done');
    });
  }

  function registerToBus(eventBus) {
    _.forEach(handlers, (handler, type) => {
      eventBus.register(type, event => handleEvent(event));
    });
  }

  function eventTypes() {
    return _.keys(handlers);
  }

  function handleEvent(event) {
    return promising
      .try(() => handlers[event.type](event))
      .catch(rejection => {
        options.log.error(`Update failed on event ${event.id}`, rejection);
        throw rejection;
      });
  }
}

module.exports = createProjectionUpdater;
