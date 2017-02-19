'use strict';

const _ = require('lodash');

class Queue {

  constructor(options) {
    this._options = _.defaults(options, {capacity: Number.MAX_SAFE_INTEGER});
    this._resolvers = [];
  }

  enqueue(action) {
    let self = this;

    if (capacityReached()) {
      return Promise.resolve();
    }

    let {resolve, promise} = createDeferred();
    this._resolvers.push(resolve);

    ifAloneDequeueNext();

    return promise
      .then(() => action())
      .then(result => {
        runComplete();
        return result;
      })
      .catch(rejection => {
        runComplete();
        throw rejection;
      });

    function capacityReached() {
      return self._resolvers.length >= self._options.capacity;
    }

    function createDeferred() {
      let resolve;
      let promise = new Promise(r => {
        resolve = r;
      });
      return {promise, resolve};
    }

    function ifAloneDequeueNext() {
      if (aloneInQueue()) {
        dequeueNext();
      }
    }

    function aloneInQueue() {
      return self._resolvers.length === 1;
    }

    function runComplete() {
      self._resolvers.shift();
      dequeueNext();
    }

    function dequeueNext() {
      if (self._resolvers.length > 0) {
        self._resolvers[0]();
      } else {
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

module.exports = {Queue};
