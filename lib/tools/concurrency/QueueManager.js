'use strict';

const _ = require('lodash');
const Queue = require('./Queue');

class QueueManager {

  constructor() {
    this._queues = new Map();
  }

  queue(id, options) {
    if (this._seemsBlank(id)) {
      throw new Error('Queue id cannot be blank');
    }
    if (!this._queues.has(id)) {
      this._createQueue(id, options);
    }
    return this._queues.get(id);
  }

  _createQueue(id, options) {
    let queueOptions = Object.assign({
      onEmpty: () => {
        this._queueEmpty(id);
      }
    }, options);
    this._queues.set(id, new Queue(queueOptions));
  }

  _queueEmpty(id) {
    this._queues.delete(id);
  }

  _seemsBlank(id) {
    return id === '' || id === null || id === undefined || _.isEqual(id, {});
  }
}

module.exports = QueueManager;
