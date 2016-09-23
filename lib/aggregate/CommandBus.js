'use strict';

const {MessageBus} = require('../messaging');

class CommandBus extends MessageBus {

  constructor(options) {
    super(Object.assign({}, options, {exclusiveListeners: true}));
  }
}

module.exports = CommandBus;
