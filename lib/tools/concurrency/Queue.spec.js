'use strict';

const _ = require('lodash');
const Bluebird = require('bluebird');
const Queue = require('./Queue');

describe('The queue', () => {

  let queue;

  beforeEach(() => {
    queue = new Queue();
  });

  it('should run action if empty', () => {
    let action = () => {
      return Bluebird.try(() => {
        return 'run';
      });
    };

    return queue.enqueue(action).then(result => {
      result.should.equal('run');
    });
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
    let queue = new Queue({limit: 2});

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

  function asyncAction(action) {
    return () => Bluebird.try(action);
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
