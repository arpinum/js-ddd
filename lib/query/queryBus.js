'use strict';

const {createMessageBus} = require('@arpinum/messaging');

function createQueryBus(creation) {
  return createMessageBus(Object.assign({}, {exclusiveHandlers: true}, creation));
}

module.exports = createQueryBus;
