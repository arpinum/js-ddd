'use strict';

const MessageBus = require('./MessageBus');

function EventBus(options) {
  return new MessageBus(options);
}

function CommandBus(options) {
  return new MessageBus(Object.assign({}, options, {exclusiveHandlers: true}));
}

function QueryBus(options) {
  return new MessageBus(Object.assign({}, options, {exclusiveHandlers: true}));
}

module.exports = {
  EventBus,
  CommandBus,
  QueryBus
};
