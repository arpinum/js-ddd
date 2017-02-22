'use strict';

const Message = require('./message');

class Event extends Message {

  constructor(creation) {
    super(Object.assign({}, creation, {date: new Date()}));
  }
}

module.exports = Event;
