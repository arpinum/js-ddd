'use strict';

const {MessageBus} = require('@arpinum/messaging');

class CommandBus extends MessageBus {

  constructor(creation = {}) {
    super(Object.assign({}, {exclusiveHandlers: true}, creation));
  }
}

module.exports = CommandBus;
