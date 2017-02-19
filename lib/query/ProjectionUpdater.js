'use strict';

const _ = require('lodash');
const t = require('tcomb');
const co = require('co');
const {TypedEventStore} = require('../types');
const {object, promising} = require('../tools');
const {executePromiseInBatch} = require('../tools').stream;
const {Logger, TypedLogger} = require('@arpinum/log');

const Creation = t.interface({
  eventStore: TypedEventStore,
  isEmpty: t.Function,
  handlers: t.Object,
  options: t.maybe(t.interface({
    log: t.maybe(TypedLogger)
  }))
});

class ProjectionUpdater {

  constructor(creation) {
    let {eventStore, isEmpty, handlers, options} = Creation(creation);
    object.assignPrivately(this, {
      _eventStore: eventStore,
      _isEmpty: isEmpty,
      _handlers: handlers,
      _options: Object.assign({}, {log: new Logger({fileName: __filename}), options})
    });
  }

  build() {
    let self = this;
    return co(function *() {
      if (yield self._isEmpty()) {
        return buildFromEvents();
      }
      return Promise.resolve();
    });
    function buildFromEvents() {
      return co(function *() {
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
    return promising
      .try(() => self._handlers[event.type](event))
      .catch(rejection => {
        self._options.log.error(`Update failed on event ${event.id}`, rejection);
        throw rejection;
      });
  }
}

module.exports = ProjectionUpdater;
