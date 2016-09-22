'use strict';

const Bluebird = require('bluebird');
const _ = require('lodash');

class Queue {

  constructor(options) {
    this._options = _.defaults(options, {limit: 0});
    this._actions = [];
  }

  enqueue(action) {
    if (this._limitReached()) {
      return Promise.resolve();
    }
    return this._doEnqueue(action);
  }

  _limitReached() {
    return this._options.limit > 0 && this._actions.length >= this._options.limit;
  }

  _doEnqueue(action) {
    let deferredAction = this._deferredAction(action);
    this._actions.push(deferredAction.action);
    this._ensureDequeue();
    return deferredAction.promise;
  }

  _deferredAction(action) {
    let result = {};
    result.promise = new Promise((resolve, reject) => {
      result.action = () => Bluebird.try(action).then(resolve).catch(reject);
    });
    return result;
  }

  _ensureDequeue() {
    var self = this;
    if (!self._active) {
      dequeue();
    }

    function dequeue() {
      if (!_.isEmpty(self._actions)) {
        self._active = true;
        let action = self._actions.shift();
        action()
          .finally(() => {
            dequeue();
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
