'use strict';

const QueueManager = require('./QueueManager');

describe('The queue manager', () => {

  let manager;

  beforeEach(() => {
    manager = new QueueManager();
  });

  it('should return different queues for different id', () => {
    let firstQueue = manager.queue('1');
    let secondQueue = manager.queue('2');

    secondQueue.should.not.equal(firstQueue);
  });

  it('should return the same queue for the same id', () => {
    let firstQueue = manager.queue('1');
    let secondQueue = manager.queue('1');

    firstQueue.should.equal(secondQueue);
  });

  it('should allow id as integer', () => {
    let firstQueue = manager.queue(1);
    let secondQueue = manager.queue(1);
    let thirdQueue = manager.queue(2);

    firstQueue.should.equal(secondQueue);
    firstQueue.should.not.equal(thirdQueue);
  });

  it('should forget queue when empty', () => {
    let queue = manager.queue('1');

    queue._dequeue();

    let queueWithSameId = manager.queue('1');
    queueWithSameId.should.not.equal(queue);
  });

  it('should fail if asked queue is blank', () => {
    let call = () => manager.queue({});

    call.should.throw(Error, 'Queue id cannot be blank');
  });
});
