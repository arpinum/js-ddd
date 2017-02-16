'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {FunctionalError} = require('../../errors');
const {Logger} = require('@arpinum/log');
const promising = require('../promising');
const Message = require('./Message');

function Factory(creation = {}) {
  let {options:rawOptions} = creation;

  let options = Object.assign({}, {
    exclusiveHandlers: false,
    log: Logger({fileName: __filename}),
    handlersConcurrency: 3
  }, rawOptions);

  let handlerMap = new Map();

  return {
    broadcastAll,
    broadcast,
    register
  };

  function broadcastAll(messages) {
    return promising.map(messages, message => broadcast(message));
  }

  function broadcast(message) {
    let messageCopy = Message(message);
    options.log.debug('Broadcasting', messageCopy.type);
    let handlers = handlerMap.get(messageCopy.type) || [];
    if (_.isEmpty(handlers)) {
      return Promise.resolve();
    }
    if (options.exclusiveHandlers) {
      return handlers[0](messageCopy);
    }
    return promising.map(handlers, handler => {
      return handler(messageCopy);
    }, {concurrency: options.handlersConcurrency});
  }

  function register(messageType, handler) {
    options.log.debug('Registering to', messageType);
    if (!handlerMap.has(messageType)) {
      handlerMap.set(messageType, []);
    }
    let handlers = handlerMap.get(messageType);
    if (options.exclusiveHandlers && handlers.length > 0) {
      throw new FunctionalError(`Won't allow a new handler for type ${messageType} since handlers are exclusive`);
    }
    handlers.push(handler);
  }
}

const Creation = t.maybe(t.interface({
  options: t.maybe(t.interface({
    log: t.maybe(t.Object),
    exclusiveHandlers: t.maybe(t.Boolean),
    handlersConcurrency: t.maybe(t.Integer),
  }))
}));

const MessageBus = t.interface({
  broadcastAll: t.Function,
  broadcast: t.Function,
  register: t.Function
});

module.exports = t.func(Creation, MessageBus).of(Factory);
