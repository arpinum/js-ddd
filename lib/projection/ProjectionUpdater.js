'use strict';

const _ = require('lodash');
const t = require('tcomb');
const co = require('co');
const TechnicalError = require('../errors').TechnicalError;
const {promising} = require('../tools');
const {executePromiseInBatch} = require('../tools').stream;
const {createLogger} = require('@arpinum/log');

const Dependencies = t.struct({
  eventStore: t.Object,
  options: t.maybe(t.Object)
}, {strict: true});

class ProjectionUpdater {

  constructor(dependencies) {
    let {eventStore, options} = Dependencies(dependencies);

    this._eventStore = eventStore;
    this._options = _.defaults(options || {}, {
      log: createLogger({fileName: __filename}),
    });
  }

  get projectionName() {
    throw new TechnicalError('Must be implemented');
  }

  isEmpty() {
    throw new TechnicalError('Must be implemented');
  }

  registerToBus(eventBus) {
    _.forEach(this.handlers, (handler, type) => {
      eventBus.register(type, event => this._handleEvent(event));
    });
  }

  build() {
    let self = this;
    if (!this._build) {
      this._build = buildIfNeeded();
    }
    return this._build;

    function buildIfNeeded() {
      return co(function *() {
        if (yield self.isEmpty()) {
          return build();
        }
        return Promise.resolve();
      });
    }

    function build() {
      return co(function *() {
        self._options.log.debug('Projection build started');
        let stream = self._eventStore.eventsFromTypes(eventTypes());
        yield executePromiseInBatch(stream, event => self._handleEvent(event));
        self._options.log.debug('Projection build done');
      });
    }

    function eventTypes() {
      return _.keys(self.handlers);
    }
  }

  _handleEvent(event) {
    let self = this;
    return co(function *() {
      try {
        yield promising.try(() => self.handlers[event.type](event));
      } catch (rejection) {
        self._options.log.error(`Update failed on event ${event.id}`, rejection);
        throw rejection;
      }
    });
  }

  informationFromCreationEvent(event) {
    return {_id: event.aggregateRoot.id, creationDate: event.date};
  }
}

module.exports = ProjectionUpdater;
