'use strict';

const _ = require('lodash');
const {FunctionalError} = require('../errors');
const {Event} = require('../messaging');

class AggregateRoot {

  constructor(information) {
    if (!information || !information.id) {
      throw new FunctionalError('Entity must have an id');
    }
    Object.assign(this, information);
  }

  createEvent(eventOrType, payloadMaybe) {
    return this._eventFrom(eventOrType, payloadMaybe)
      .concerningAggregateRoot(this.id, this.constructor.name);
  }

  _eventFrom(eventOrType, payloadMaybe) {
    if (_.isObject(eventOrType)) {
      return eventOrType;
    }
    return new Event(eventOrType, payloadMaybe);
  }

  markAsDeleted() {
    this.deleted = true;
    return this;
  }
}

module.exports = AggregateRoot;
