'use strict';

const _ = require('lodash');
const {mapSeries, Queue} = require('@arpinum/promising');
const {Readable} = require('stream');

class ArrayStream extends Readable {

  constructor(elements) {
    super({objectMode: true});
    this._elements = elements;
  }

  _read() {
    for (let element of this._elements) {
      this.push(element);
    }
    this.push(null);
  }
}

function createArrayStream(elements) {
  return new ArrayStream(elements);
}

function executePromiseInBatch(stream, promiseFunction, options) {
  let _options = _.defaults({}, options, {batchSize: 1000});
  let flushQueue = new Queue();
  let batch = [];
  return new Promise((resolve, reject) => {
    stream.on('data', data => {
      batch.push(data);
      if (batch.length === _options.batchSize) {
        stream.pause();
        enqueueFlushBatch()
          .then(() => stream.resume())
          .catch(reject);
      }
    });
    stream.on('error', error => {
      reject(error);
    });
    stream.once('end', () => {
      enqueueFlushBatch()
        .then(resolve)
        .catch(reject);
    });
  });

  function enqueueFlushBatch() {
    return flushQueue.enqueue(flushBatch);
  }

  function flushBatch() {
    return mapSeries(batch, promiseFunction)
      .then(() => {
        batch = [];
      });
  }
}

module.exports = {
  createArrayStream,
  executePromiseInBatch
};
