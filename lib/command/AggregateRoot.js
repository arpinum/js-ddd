'use strict';

const _ = require('lodash');
const t = require('tcomb');
const Event = require('./event/Event');

const Construction = t.struct({
  id: t.String,
  aggregateName: t.String,
  handlers: t.Object
}, {strict: true});

function AggregateRoot(construction) {
  let {id, aggregateName, handlers} = Construction(construction);
  let instance = {
    id,
    aggregateName,
    createEvent,
    applyEvent
  };
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
    let handler = handlers[event.type] || (() => undefined);
    return handler(event, instance);
  }
}

module.exports = AggregateRoot;
