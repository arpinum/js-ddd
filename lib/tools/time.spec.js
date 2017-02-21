'use strict';

const {TimeContract} = require('../types');
const Time = require('./time');

describe('A time', () => {

  context('while being created from information', () => {
    it('could be created with partial information', () => {
      let time = new Time({});

      time.hours.should.equal(0);
      time.minutes.should.equal(0);
      time.seconds.should.equal(0);
    });
  });

  context('after creation', () => {
    it('should match TimeContract', () => {
      let time = new Time();

      TimeContract.is(time).should.be.true;
    });
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

  context('while formatting as string', () => {
    it('should represent all time information', () => {
      let time = new Time({hours: 12, minutes: 10, seconds: 30});

      time.asString().should.equal('12:10:30');
    });

    it('should add leading 0', () => {
      let time = new Time({hours: 1, minutes: 2, seconds: 3});

      time.asString().should.equal('01:02:03');
    });
  });

  context('while creating from a string', () => {
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

      creation.should.throw(Error);
    });

    it('could not be created from a bad formatted string', () => {
      let creation = () => Time.fromString('12:4a:28');

      creation.should.throw(Error);
    });
  });
});
