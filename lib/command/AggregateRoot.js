'use strict';

const _ = require('lodash');
const t = require('tcomb');
const {validate} = require('../tools');
const Event = require('./event/Event');

class AggregateRoot {

  constructor(id) {
    validate(this).isA(t.struct({
      handlers: t.Object
    }));
    validate(id).isA(t.Any);
    this.id = id;
  }

  createEvent(eventOrType, payloadMaybe) {
    return eventFrom(eventOrType, payloadMaybe)
      .concerningAggregate(this.id, this.constructor.name);

    function eventFrom(eventOrType, payloadMaybe) {
      if (_.isObject(eventOrType)) {
        return eventOrType;
      }
      return new Event(eventOrType, payloadMaybe);
    }
  }

  applyEvent(event) {
    let handler = this.handlers[event.type] || (() => undefined);
    handler(event, this);
  }
}

module.exports = AggregateRoot;
