'use strict';

const stream = require('./stream');

describe('The stream module', () => {

  it('should execute promise in batch', () => {
    let integerStream = stream.createArrayStream([1, 2, 3, 4]);
    let readIntegers = [];
    let promiseFunc = integer => Promise.resolve().then(() => readIntegers.push(integer));

    let executePromiseInBatch = stream.executePromiseInBatch(integerStream, promiseFunc, {batchSize: 1});

    return executePromiseInBatch.then(() => {
      readIntegers.should.deep.equal([1, 2, 3, 4]);
    });
  });

  it('should consider last batch though incomplete', () => {
    let integerStream = stream.createArrayStream([1, 2, 3, 4]);
    let readIntegers = [];
    let promiseFunc = integer => Promise.resolve().then(() => readIntegers.push(integer));

    let executePromiseInBatch = stream.executePromiseInBatch(integerStream, promiseFunc, {batchSize: 3});

    return executePromiseInBatch.then(() => {
      readIntegers.should.deep.equal([1, 2, 3, 4]);
    });
  });

  it('should reject if any error during batch processing', () => {
    let integerStream = stream.createArrayStream([1, 2, 3, 4]);
    let promiseFunc = integer => Promise.resolve().then(() => {
      if (integer === 1) {
        throw new Error('bleh');
      }
    });

    let executePromiseInBatch = stream.executePromiseInBatch(integerStream, promiseFunc, {batchSize: 200});

    executePromiseInBatch.should.be.rejectedWith(Error, 'bleh');
  });

  it('should reject if any error at the end', () => {
    let integerStream = stream.createArrayStream([1, 2, 3, 4]);
    let promiseFunc = integer => Promise.resolve().then(() => {
      if (integer === 4) {
        throw new Error('bleh');
      }
    });

    let executePromiseInBatch = stream.executePromiseInBatch(integerStream, promiseFunc, {batchSize: 200});

    executePromiseInBatch.should.be.rejectedWith(Error, 'bleh');
  });
});
