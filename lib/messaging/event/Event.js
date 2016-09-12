'use strict';

const Message = require('../message/Message');

class Event extends Message {

  constructor(type, payload) {
    super(type, payload);
    this.date = new Date();
  }

  concerningAggregateRoot(id, type) {
    this.aggregateRoot = {id, type};
    return this;
  }
}

module.exports = Event;
