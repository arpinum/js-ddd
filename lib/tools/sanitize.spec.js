'use strict';

const sanitize = require('./sanitize');
const {FunctionalError} = require('../errors');

describe('The sanitize module', () => {

  context('about integer', () => {
    it('should convert a valid integer property', () => {
      let object = {int: '12'};

      let result = sanitize(object).convert('int').toInteger();

      result.should.deep.equal({int: 12});
    });

    it('should fail if the property is defined but cannot be converted', () => {
      let object = {int: 'not an int'};

      let conversion = () => sanitize(object).convert('int').toInteger();

      conversion.should.throw(FunctionalError, 'The property int is not a valid integer');
    });
  });

  context('about boolean', () => {
    it('should convert a valid truthy boolean property', () => {
      let object = {bool: 'true'};

      let result = sanitize(object).convert('bool').toBoolean();

      result.bool.should.be.true;
    });

    it('should convert a valid falsy boolean property', () => {
      let object = {bool: 'false'};

      let result = sanitize(object).convert('bool').toBoolean();

      result.bool.should.be.false;
    });

    it('should fail if the property is defined but cannot be converted', () => {
      let object = {bool: 'not a bool'};

      let conversion = () => sanitize(object).convert('bool').toBoolean();

      conversion.should.throw(FunctionalError, 'The property bool is not a valid boolean');
    });
  });

  context('about date', () => {
    it('should convert a valid date property', () => {
      let date = new Date('1996', '12', '03');
      let object = {date: date.toISOString()};

      let result = sanitize(object).convert('date').toDate();

      result.should.deep.equal({date});
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
});
