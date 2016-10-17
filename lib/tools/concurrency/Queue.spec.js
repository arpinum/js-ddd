'use strict';

const _ = require('lodash');
const Queue = require('./Queue');
const promising = require('../promising');

describe('The queue', () => {

  let queue;

  beforeEach(() => {
    queue = new Queue();
  });

  it('should run action if empty', () => {
    let action = () => Promise.resolve('run');

    return queue.enqueue(action).should.eventually.equal('run');
  });

  it('should run queued actions sequentially', () => {
    let runs = [];

    let promises = [
      queue.enqueue(asyncAction(() => runs.push('1'))),
      queue.enqueue(asyncAction(() => runs.push('2'))),
      queue.enqueue(asyncAction(() => runs.push('3'))),
      queue.enqueue(asyncAction(() => runs.push('4'))),
      queue.enqueue(asyncAction(() => runs.push('5')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.deep.equal(['1', '2', '3', '4', '5']);
    });
  });

  it('should limit queued actions', () => {
    let runs = [];
    let queue = new Queue({capacity: 3});

    let promises = [
      queue.enqueue(asyncAction(() => runs.push('1'))),
      queue.enqueue(asyncAction(() => runs.push('2'))),
      queue.enqueue(asyncAction(() => runs.push('3'))),
      queue.enqueue(asyncAction(() => runs.push('4'))),
      queue.enqueue(asyncAction(() => runs.push('5')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.deep.equal(['1', '2', '3']);
    });
  });

  it('should accept another action though previous one has failed', () => {
    let runs = [];
    let queue = new Queue({capacity: 2});

    let promises = [
      queue.enqueue(() => Promise.reject('failure')).catch(() => runs.push('failing action')),
      queue.enqueue(asyncAction(() => runs.push('second action')))
    ];

    return Promise.all(promises).then(() => {
      runs.should.include('failing action');
      runs.should.include('second action');
    });
  });

  function asyncAction(action) {
    return () => promising.try(action);
  }

  it('should call on empty callback when queue become empty', (done) => {
    let queue = new Queue({
      onEmpty: () => {
        done();
      }
    });

    queue.enqueue(_.noop);
  });
});
