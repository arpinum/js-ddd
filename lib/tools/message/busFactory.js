'use strict';

const MessageBus = require('./MessageBus');

function createEventBus(options) {
  return new MessageBus(options);
}

function createCommandBus(options) {
  return new MessageBus(Object.assign({}, options, {exclusiveHandlers: true}));
}

function createQueryBus(options) {
  return new MessageBus(Object.assign({}, options, {exclusiveHandlers: true}));
}

module.exports = {
  createEventBus,
  createCommandBus,
  createQueryBus
};
