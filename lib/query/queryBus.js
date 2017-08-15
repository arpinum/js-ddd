'use strict';

const {MessageBus} = require('@arpinum/messaging');

class QueryBus extends MessageBus {

  constructor(creation = {}) {
    super(Object.assign({}, {exclusiveHandlers: true}, creation));
  }
}

module.exports = QueryBus;
