'use strict';

const Bluebird = require('bluebird');
const t = require('tcomb');
const {TechnicalError} = require('../../errors');
const validate = require('../validate');

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
    return Bluebird
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
