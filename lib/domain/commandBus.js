'use strict';

const {MessageBus} = require('../tools');

class CommandBus extends MessageBus {

  constructor(creation = {}) {
    super(Object.assign({}, {exclusiveHandlers: true}, creation));
  }
}

module.exports = CommandBus;
