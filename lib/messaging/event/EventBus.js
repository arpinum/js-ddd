'use strict';

const MessageBus = require('../message/MessageBus');

class EventBus extends MessageBus {

  constructor(options) {
    super(options);
  }
}

module.exports = EventBus;
