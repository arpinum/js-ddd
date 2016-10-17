'use strict';

const _ = require('lodash');
const Queue = require('./Queue');

class QueueManager {

  constructor() {
    this._queues = new Map();
  }

  queue(id, options) {
    if (idSeemsBlank(id)) {
      throw new Error('Queue id cannot be blank');
    }
    if (!this._queues.has(id)) {
      this._createQueue(id, options);
    }
    return this._queues.get(id);

    function idSeemsBlank() {
      return id === '' || id === null || id === undefined || _.isEqual(id, {});
    }
  }

  _createQueue(id, options) {
    let self = this;
    let queueOptions = Object.assign({onEmpty: queueEmpty}, options);
    this._queues.set(id, new Queue(queueOptions));

    function queueEmpty(id) {
      self._queues.delete(id);
    }
  }
}

module.exports = QueueManager;
