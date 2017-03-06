'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {FunctionalError} = require('../../errors');
const {Logger, LoggerContract} = require('@arpinum/log');
const {map:mapToPromises} = require('../promising');
const Message = require('./message');

const Creation = t.maybe(t.interface({
  log: t.maybe(LoggerContract),
  exclusiveHandlers: t.maybe(t.Boolean),
  handlersConcurrency: t.maybe(t.Integer),
}));

class MessageBus {

  constructor(creation = {}) {
    let {log, exclusiveHandlers, handlersConcurrency} = Creation(creation);
    this._log = log || new Logger({fileName: __filename});
    this._exclusiveHandlers = exclusiveHandlers || false;
    this._handlersConcurrency = handlersConcurrency || 3;
    this._handlerMap = new Map();
  }

  broadcastAll(messages) {
    return mapToPromises(messages, message => this.broadcast(message));
  }

  broadcast(message) {
    let messageCopy = new Message(message);
    this._log.debug('Broadcasting', messageCopy.type);
    let handlers = this._handlerMap.get(messageCopy.type) || [];
    if (_.isEmpty(handlers)) {
      return Promise.resolve();
    }
    if (this._exclusiveHandlers) {
      return handlers[0](messageCopy);
    }
    return mapToPromises(handlers, handler => {
      return handler(messageCopy);
    }, {concurrency: this._handlersConcurrency});
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
