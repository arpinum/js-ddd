'use strict';

const _ = require('lodash');
const t = require('tcomb');
const co = require('co');
const { wrap } = require('@arpinum/promising');
const { createLogger } = require('@arpinum/log');
const { EventStoreContract, LoggerContract } = require('../types');
const { executePromiseInBatch } = require('../tools').stream;

const Creation = t.interface({
  eventStore: EventStoreContract,
  isEmpty: t.Function,
  handlers: t.Object,
  options: t.maybe(
    t.interface({
      log: t.maybe(LoggerContract)
    })
  )
});

class ProjectionUpdater {
  constructor(creation) {
    let { eventStore, isEmpty, handlers, options } = Creation(creation);
    this._eventStore = eventStore;
    this._isEmpty = isEmpty;
    this._handlers = handlers;
    this._options = Object.assign(
      {},
      { log: createLogger({ fileName: __filename }), options }
    );
  }

  build() {
    let self = this;
    return co(function*() {
      if (yield self._isEmpty()) {
        return buildFromEvents();
      }
      return Promise.resolve();
    });

    function buildFromEvents() {
      return co(function*() {
        self._options.log.debug('Projection build started');
        let stream = self._eventStore.eventsFromTypes(eventTypes());
        yield executePromiseInBatch(stream, event => self._handleEvent(event));
        self._options.log.debug('Projection build done');
      });
    }

    function eventTypes() {
      return _.keys(self._handlers);
    }
  }

  registerToBus(eventBus) {
    _.forEach(this._handlers, (handler, type) => {
      eventBus.register(type, event => this._handleEvent(event));
    });
  }

  _handleEvent(event) {
    let self = this;
    return wrap(self._handlers[event.type])(event).catch(rejection => {
      self._options.log.error(`Update failed on event ${event.id}`, rejection);
      throw rejection;
    });
  }
}

module.exports = ProjectionUpdater;
