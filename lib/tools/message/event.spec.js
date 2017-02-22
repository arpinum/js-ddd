'use strict';

const should = require('chai').should();
const {EventContract} = require('../../types');
const Event = require('./event');

describe('A event', () => {

  it('should match EventContract', () => {
    let event = new Event({type: 'Tadaa', payload: {the: 'payload'}});

    EventContract.is(event).should.be.true;
  });

  it('should have a date', () => {
    let event = new Event({type: 'Tadaa', payload: {the: 'payload'}});

    should.exist(event.date);
  });
});
