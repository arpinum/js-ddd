'use strict';

const {promising} = require('../tools');

class MemoryProjectionTracker {

  constructor() {
    this._projections = new Map();
  }

  getLastProcessedEventId(projectionName) {
    return promising.try(() => this._projections.get(projectionName));
  }

  updateLastProcessedEventId(projectionName, id) {
    return promising.try(() => this._projections.set(projectionName, id));
  }
}

module.exports = MemoryProjectionTracker;
