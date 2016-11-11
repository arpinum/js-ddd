'use strict';

const _ = require('lodash');
const {FunctionalError} = require('../../errors');
const Logger = require('../Logger');
const promising = require('../promising');
const Message = require('./Message');

class MessageBus {

  constructor(options) {
    this._options = _.defaults({}, options, {
      exclusiveHandlers: false,
      log: new Logger({fileName: __filename}),
      handlersConcurrency: 3
    });
    this._handlerMap = new Map();
  }

  broadcastAll(messages) {
    return promising.map(messages, message => this.broadcast(message));
  }

  broadcast(messageOrType, payloadMaybe) {
    let message = createMessage();
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

    function createMessage() {
      if (_.isObject(messageOrType)) {
        return messageOrType;
      }
      return new Message(messageOrType, payloadMaybe);
    }
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
