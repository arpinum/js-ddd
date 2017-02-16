'use strict';

const MessageBus = require('./MessageBus');

function EventBus({options} = {}) {
  return MessageBus({options});
}

function CommandBus({options} = {}) {
  return MessageBus({options: Object.assign({}, {exclusiveHandlers: true}, options)});
}

function QueryBus({options} = {}) {
  return MessageBus({options: Object.assign({}, {exclusiveHandlers: true}, options)});
}

module.exports = {
  EventBus,
  CommandBus,
  QueryBus
};
