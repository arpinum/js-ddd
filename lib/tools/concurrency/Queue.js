'use strict';

const _ = require('lodash');
const promising = require('../promising');

class Queue {

  constructor(options) {
    this._options = _.defaults(options, {limit: 0});
    this._actions = [];
  }

  enqueue(action) {
    let self = this;
    if (limitReached()) {
      return Promise.resolve();
    }
    return doEnqueue(action);

    function limitReached() {
      return self._options.limit > 0 && self._actions.length >= self._options.limit;
    }

    function doEnqueue(action) {
      let deferredAction = deferAction(action);
      self._actions.push(deferredAction.action);
      ensureDequeue();
      return deferredAction.promise;
    }

    function deferAction(action) {
      let result = {};
      result.promise = new Promise((resolve, reject) => {
        result.action = () => promising.try(action).then(resolve).catch(reject);
      });
      return result;
    }

    function ensureDequeue() {
      if (!self._active) {
        dequeue();
      }
    }

    function dequeue() {
      if (!_.isEmpty(self._actions)) {
        self._active = true;
        let action = self._actions.shift();
        action()
          .then(() => dequeue())
          .catch(r => {
            dequeue();
            throw r;
          });
      } else {
        delete self._active;
        triggerEmpty();
      }
    }

    function triggerEmpty() {
      if (self._options.onEmpty) {
        self._options.onEmpty();
      }
    }
  }
}

module.exports = Queue;
