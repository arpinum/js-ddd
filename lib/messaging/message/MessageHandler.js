'use strict';

const Bluebird = require('bluebird');
const t = require('tcomb');
const TechnicalError = require('../../errors').TechnicalError;
const validate = require('../../tools').validate;

class MessageHandler {

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

  handle() {
    throw new TechnicalError('Not implemented');
  }

  get messageName() {
    throw new TechnicalError('Not implemented');
  }

  get PayloadType() {
    return t.Any;
  }
}

module.exports = MessageHandler;
