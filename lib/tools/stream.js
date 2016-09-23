'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
let {Readable} = require('stream');

let stream = {
  createArrayStream,
  executePromiseInBatch
};

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
  let _options = _.defaults(options || {}, {batchSize: 1000});
  let batch = [];
  return new Promise((resolve, reject) => {
    stream.on('data', data => {
      if (batch.length === _options.batchSize) {
        stream.pause();
        flushBatch()
          .then(() => stream.resume())
          .catch(reject);
      } else {
        batch.push(data);
      }
    });
    stream.on('error', error => {
      reject(error);
    });
    stream.once('end', () => {
      flushBatch()
        .then(() => resolve())
        .catch(reject);
    });
  });

  function flushBatch() {
    return Bluebird
      .mapSeries(batch, element => promiseFunction(element))
      .then(() => Object.assign(batch, []));
  }
}

module.exports = stream;
