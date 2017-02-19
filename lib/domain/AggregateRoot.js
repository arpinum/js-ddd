'use strict';

const t = require('tcomb');
const {object} = require('../tools');
const {Message} = require('../tools');

const Creation = t.interface({
  id: t.String,
  aggregateName: t.String,
  handlers: t.Object
}, {strict: true});

class AggregateRoot {

  constructor(creation) {
    let {id, aggregateName, handlers} = Creation(creation);
    object.assignPrivately(this, {
      _handlers: handlers
    });
    this.id = id;
    this.aggregateName = aggregateName;
  }

  createEvent(message) {
    let aggregatePart = {aggregate: {id: this.id, type: this.aggregateName}};
    return new Message(Object.assign({}, message, aggregatePart));
  }

  applyEvent(event) {
    let handler = this._handlers[event.type] || (() => this);
    return handler(event, this);
  }
}

module.exports = AggregateRoot;
