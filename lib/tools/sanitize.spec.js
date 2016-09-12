'use strict';

const sanitize = require('./sanitize');
const FunctionalError = require('../errors').FunctionalError;

describe('The sanitize module', () => {

  it('should convert a valid date property', () => {
    let date = new Date('1996', '12', '03');
    let object = {date: date.toISOString()};

    let result = sanitize(object).convert('date').toDate();

    result.should.deep.equal({date});
  });

  it('should convert a valid integer property', () => {
    let object = {int: '12'};

    let result = sanitize(object).convert('int').toInteger();

    result.should.deep.equal({int: 12});
  });

  it('should convert a deeply defined property', () => {
    let date = new Date('1996', '12', '03');
    let object = {the: {super: {date: date.toISOString()}}};

    let result = sanitize(object).convert('the.super.date').toDate();

    result.should.deep.equal({the: {super: {date}}});
  });

  it('should do nothing if the property is undefined', () => {
    let object = {nothing: 'todo'};

    let result = sanitize(object).convert('date').toDate();

    result.should.deep.equal({nothing: 'todo'});
  });

  it('should fail if the property is defined but cannot be converted', () => {
    let object = {theDate: 'not a date'};

    let conversion = () => sanitize(object).convert('theDate').toDate();

    conversion.should.throw(FunctionalError, 'The property theDate is not a valid date');
  });
});
