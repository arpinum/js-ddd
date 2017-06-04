'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {Logger, LoggerContract} = require('@arpinum/log');
const {map: mapToPromises, try: asyncTry, flow} = require('@arpinum/promise');
const {FunctionalError} = require('../../errors');
const Message = require('./message');

const Creation = t.maybe(t.interface({
  log: t.maybe(LoggerContract),
  exclusiveHandlers: t.maybe(t.Boolean),
  handlersConcurrency: t.maybe(t.Integer),
  beforeHandle: t.maybe(t.list(t.Function)),
  afterHandle: t.maybe(t.list(t.Function))
}, {strict: true}));

class MessageBus {

  constructor(creation = {}) {
    let {
      log,
      exclusiveHandlers,
      handlersConcurrency,
      beforeHandle,
      afterHandle
    } = Creation(creation);
    this._log = log || new Logger({fileName: __filename});
    this._exclusiveHandlers = exclusiveHandlers || false;
    this._handlersConcurrency = handlersConcurrency || 3;
    this._beforeHandle = beforeHandle || [];
    this._afterHandle = afterHandle || [];
    this._handlerMap = new Map();
  }

  broadcastAll(messages) {
    return mapToPromises(messages, message => this.broadcast(message));
  }

  broadcast(message) {
    let self = this;
    let messageCopy = new Message(message);
    this._log.debug('Broadcasting', messageCopy.type);
    let handlers = this._handlerMap.get(messageCopy.type) || [];
    if (_.isEmpty(handlers)) {
      return Promise.resolve();
    }
    if (this._exclusiveHandlers) {
      return handle(handlers[0]);
    }
    return mapToPromises(handlers, handle, {concurrency: this._handlersConcurrency});

    function handle(handler) {
      let promiseSafeHandler = message => asyncTry(() => handler(message));
      return flow(self._beforeHandle)(messageCopy)
        .then(promiseSafeHandler)
        .then(flow(self._afterHandle));
    }
  }

  register(messageType, handler) {
    this._log.debug('Registering to', messageType);
    if (!this._handlerMap.has(messageType)) {
      this._handlerMap.set(messageType, []);
    }
    let handlers = this._handlerMap.get(messageType);
    if (this._exclusiveHandlers && handlers.length > 0) {
      throw new FunctionalError(`Won't allow a new handler for type ${messageType} since handlers are exclusive`);
    }
    handlers.push(handler);
  }
}

module.exports = MessageBus;
