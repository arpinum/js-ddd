'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const {stream} = require('../../tools');

class MemoryEventStore {

  constructor() {
    this.events = [];
    this._currentId = 0;
  }

  add(event) {
    return Bluebird.try(() => {
      this.events.push(Object.assign({}, event, {id: this._generateId()}));
    });
  }

  _generateId() {
    let id = this._currentId;
    this._currentId++;
    return id;
  }

  addAll(events) {
    return Bluebird.try(() => {
      for (let event of events) {
        this.add(event);
      }
    });
  }

  eventsFromAggregate(id, type) {
    let events = _.filter(
      this.events,
      e => _.get(e, 'aggregateRoot.id') === id && _.get(e, 'aggregateRoot.type') === type);
    return stream.createArrayStream(events);
  }

  eventsFromTypes(types, newerThanThisEventId) {
    let events = this.allEventsFromTypes(types, newerThanThisEventId);
    return stream.createArrayStream(events);
  }

  allEventsFromTypes(types, newerThanThisEventId) {
    return _.filter(this.events, e => {
      let valid = _.includes(types, e.type);
      if (!_.isNil(newerThanThisEventId)) {
        valid = valid && e.id > newerThanThisEventId;
      }
      return valid;
    });
  }
}

module.exports = MemoryEventStore;
