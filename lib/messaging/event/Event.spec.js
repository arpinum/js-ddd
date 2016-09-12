'use strict';

const should = require('chai').should();
const Event = require('./Event');

describe('An event', () => {

  it('should be created with current date', () => {
    let event = new Event();

    should.exist(event.date);
  });

  it('could concern a aggregate', () => {
    let event = new Event();

    event = event.concerningAggregateRoot('1337', 'the aggregate');

    event.aggregateRoot.should.deep.equal({id: '1337', type: 'the aggregate'});
  });
});
