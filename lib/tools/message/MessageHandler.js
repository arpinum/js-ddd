'use strict';

const t = require('tcomb');
const validate = require('../validate');
const promising = require('../promising');

class MessageHandler {

  constructor() {
    validate(this).isA(t.struct({
      messageName: t.String,
      handle: t.Function
    }));
  }

  registerToBus(bus) {
    bus.register(this.messageName, message => this._validateAndHandle(message));
  }

  _validateAndHandle(message) {
    return promising
      .try(() => this._validate(message))
      .then(() => this.handle(message));
  }

  _validate(message) {
    validate(message.payload).isA(this.PayloadType);
  }

  get PayloadType() {
    return t.Any;
  }
}

module.exports = MessageHandler;
