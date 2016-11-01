'use strict';

const _ = require('lodash');
const Queue = require('./Queue');

class QueueManager {

  constructor() {
    this._queues = new Map();
  }

  queue(id, options) {
    let self = this;
    if (idSeemsBlank(id)) {
      throw new Error('Queue id cannot be blank');
    }
    if (!this._queues.has(id)) {
      createQueue(id, options);
    }
    return this._queues.get(id);

    function idSeemsBlank() {
      return id === '' || id === null || id === undefined || _.isEqual(id, {});
    }

    function createQueue(id, options) {
      let queueOptions = Object.assign({onEmpty: queueEmpty}, options);
      self._queues.set(id, new Queue(queueOptions));

      function queueEmpty() {
        self._queues.delete(id);
      }
    }
  }
}

module.exports = QueueManager;
