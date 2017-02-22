'use strict';

const t = require('tcomb');
const {Event} = require('../tools');

const Creation = t.interface({
  id: t.String,
  aggregateName: t.String,
  handlers: t.Object
}, {strict: true});

class AggregateRoot {

  constructor(creation) {
    let {id, aggregateName, handlers} = Creation(creation);
    this.id = id;
    this._handlers = handlers;
    this.aggregateName = aggregateName;
  }

  createEvent(message) {
    let aggregatePart = {aggregate: {id: this.id, type: this.aggregateName}};
    return new Event(Object.assign({}, message, aggregatePart));
  }

  applyEvent(event) {
    let handler = this._handlers[event.type] || (() => this);
    return handler(event, this);
  }
}

module.exports = AggregateRoot;
