'use strict';

const {ValidationError} = require('../../errors');
const {Time} = require('./time');

describe('A time', () => {

  context('while being created from a string', () => {
    it('should extract time information', () => {
      let time = Time.fromString('19:22:37');

      time.hours.should.equal(19);
      time.minutes.should.equal(22);
      time.seconds.should.equal(37);
    });

    it('should allow string with only hours', () => {
      let time = Time.fromString('19');

      time.hours.should.equal(19);
      time.minutes.should.equal(0);
      time.seconds.should.equal(0);
    });

    it('should allow string with only hours and minutes', () => {
      let time = Time.fromString('19:22');

      time.hours.should.equal(19);
      time.minutes.should.equal(22);
      time.seconds.should.equal(0);
    });

    it('could not be created from an empty string', () => {
      let creation = () => Time.fromString('');

      creation.should.throw(ValidationError);
    });

    it('could not be created from a bad formatted string', () => {
      let creation = () => Time.fromString('12:4a:28');

      creation.should.throw(ValidationError);
    });
  });

  it('could not be created with invalid information', () => {
    let creation = () => new Time({firstName: 'the time'});
    creation.should.throw(ValidationError);
  });

  it('could compute total hours', () => {
    let time = new Time({hours: 2, minutes: 10, seconds: 30});

    time.asHours().should.equal(2.175);
  });

  it('could compute total minutes', () => {
    let time = new Time({hours: 2, minutes: 10, seconds: 30});

    time.asMinutes().should.equal(130.5);
  });

  it('could compute total seconds', () => {
    let time = new Time({hours: 2, minutes: 10, seconds: 30});

    time.asSeconds().should.equal(7830);
  });
});
