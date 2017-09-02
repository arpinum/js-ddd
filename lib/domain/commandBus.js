'use strict';

const {createMessageBus} = require('@arpinum/messaging');

function createCommandBus(creation) {
  return createMessageBus(Object.assign({}, {exclusiveHandlers: true}, creation));
}

module.exports = createCommandBus;
