'use strict';

const Time = require('./time');

describe('A time', () => {

  context('while being created from information', () => {
    it('could be created with partial information', () => {
      let time = Time({});

      time.hours.should.equal(0);
      time.minutes.should.equal(0);
      time.seconds.should.equal(0);
    });
  });

  it('could compute total hours', () => {
    let time = Time({hours: 2, minutes: 10, seconds: 30});

    time.asHours().should.equal(2.175);
  });

  it('could compute total minutes', () => {
    let time = Time({hours: 2, minutes: 10, seconds: 30});

    time.asMinutes().should.equal(130.5);
  });

  it('could compute total seconds', () => {
    let time = Time({hours: 2, minutes: 10, seconds: 30});

    time.asSeconds().should.equal(7830);
  });

  context('while formatting as string', () => {
    it('should represent all time information', () => {
      let time = Time({hours: 12, minutes: 10, seconds: 30});

      time.asString().should.equal('12:10:30');
    });

    it('should add leading 0', () => {
      let time = Time({hours: 1, minutes: 2, seconds: 3});

      time.asString().should.equal('01:02:03');
    });
  });
});
