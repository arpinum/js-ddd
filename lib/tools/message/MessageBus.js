'use strict';

const _ = require('lodash');
const {FunctionalError} = require('../../errors');
const {Logger} = require('@arpinum/log');
const promising = require('../promising');
const Message = require('./Message');

class MessageBus {

  constructor(options) {
    this._options = _.defaults({}, options, {
      exclusiveHandlers: false,
      log: Logger({fileName: __filename}),
      handlersConcurrency: 3
    });
    this._handlerMap = new Map();
  }

  broadcastAll(messages) {
    return promising.map(messages, message => this.broadcast(message));
  }

  broadcast(message) {
    this._options.log.debug('Broadcasting', message.type);
    let self = this;
    let handlers = self._handlerMap.get(message.type) || [];
    if (_.isEmpty(handlers)) {
      return Promise.resolve();
    }
    if (this._options.exclusiveHandlers) {
      return handlers[0](message);
    }
    return promising.map(handlers, handler => {
      return handler(message);
    }, {concurrency: this._options.handlersConcurrency});
  }

  register(messageType, handler) {
    this._options.log.debug('Registering to', messageType);
    if (!this._handlerMap.has(messageType)) {
      this._handlerMap.set(messageType, []);
    }
    let handlers = this._handlerMap.get(messageType);
    if (this._options.exclusiveHandlers && handlers.length > 0) {
      throw new FunctionalError(`Won't allow a new handler for type ${messageType} since handlers are exclusive`);
    }
    handlers.push(handler);
  }
}

module.exports = MessageBus;
