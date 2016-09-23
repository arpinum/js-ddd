'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const {FunctionalError} = require('../../errors');
const LoggerFactory = require('../LoggerFactory');
const Message = require('./Message');

class MessageBus {

  constructor(options) {
    this._options = _.defaults(options || {}, {
      exclusiveListeners: false,
      log: new LoggerFactory().create(__filename),
      listenersConcurrency: 3
    });
    this._listenerMap = new Map();
  }

  broadcastAll(messages) {
    return Bluebird.map(messages, message => this.broadcast(message));
  }

  broadcast(messageOrType, payloadMaybe) {
    let message = this._messageFrom(messageOrType, payloadMaybe);
    this._options.log.debug('Broadcasting', message.type);
    let self = this;
    let listeners = self._listenerMap.get(message.type) || [];
    if (_.isEmpty(listeners)) {
      return Promise.resolve();
    }
    if (this._options.exclusiveListeners) {
      return listeners[0](message);
    }
    return Bluebird.map(listeners, listener => {
      return listener(message);
    }, {concurrency: this._options.listenersConcurrency});
  }

  _messageFrom(messageOrType, payloadMaybe) {
    if (_.isObject(messageOrType)) {
      return messageOrType;
    }
    return new Message(messageOrType, payloadMaybe);
  }

  register(messageType, listener) {
    this._options.log.debug('Registering to', messageType);
    if (!this._listenerMap.has(messageType)) {
      this._listenerMap.set(messageType, []);
    }
    let listeners = this._listenerMap.get(messageType);
    if (this._options.exclusiveListeners && listeners.length > 0) {
      throw new FunctionalError(`Won't allow a new listener for type ${messageType} since listeners are exclusive`);
    }
    listeners.push(listener);
  }
}

module.exports = MessageBus;
