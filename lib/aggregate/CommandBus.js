'use strict';

const MessageBus = require('../messaging').MessageBus;

class CommandBus extends MessageBus {

  constructor(options) {
    super(Object.assign({}, options, {exclusiveListeners: true}));
  }
}

module.exports = CommandBus;
