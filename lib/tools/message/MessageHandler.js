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
    let self = this;
    bus.register(this.messageName, message => validateAndHandle(message));

    function validateAndHandle(message) {
      return promising
        .try(() => validatePayload(message))
        .then(() => self.handle(message));
    }

    function validatePayload(message) {
      validate(message.payload).isA(self.PayloadType);
    }
  }

  get PayloadType() {
    return t.Any;
  }
}

module.exports = MessageHandler;
