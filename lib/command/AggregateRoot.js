'use strict';

const _ = require('lodash');
const t = require('tcomb');
const Event = require('./event/Event');

const Construction = t.interface({
  id: t.String,
  aggregateName: t.String,
  handlers: t.Object
});

function AggregateRoot(construction) {
  let instance = Object.assign({}, Construction(construction), {
    createEvent,
    applyEvent
  });
  return instance;

  function createEvent(eventOrType, payloadMaybe) {
    return eventFrom(eventOrType, payloadMaybe)
      .concerningAggregate(instance.id, instance.aggregateName);

    function eventFrom(eventOrType, payloadMaybe) {
      if (_.isObject(eventOrType)) {
        return eventOrType;
      }
      return new Event(eventOrType, payloadMaybe);
    }
  }

  function applyEvent(event) {
    let handler = instance.handlers[event.type] || (() => instance);
    return handler(event, instance);
  }
}

module.exports = AggregateRoot;
