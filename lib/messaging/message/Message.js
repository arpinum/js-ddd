'use strict';

const _ = require('lodash');

class Message {

  constructor(type, payload) {
    this.type = type;
    this.payload = _.clone(payload) || {};
  }
}

module.exports = Message;
