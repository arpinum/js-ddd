'use strict';

const timeFactory = require('./timeFactory');

describe('Time factory', () => {

  context('while creating from a string', () => {
    it('should extract time information', () => {
      let time = timeFactory.fromString('19:22:37');

      time.hours.should.equal(19);
      time.minutes.should.equal(22);
      time.seconds.should.equal(37);
    });

    it('should allow string with only hours', () => {
      let time = timeFactory.fromString('19');

      time.hours.should.equal(19);
      time.minutes.should.equal(0);
      time.seconds.should.equal(0);
    });

    it('should allow string with only hours and minutes', () => {
      let time = timeFactory.fromString('19:22');

      time.hours.should.equal(19);
      time.minutes.should.equal(22);
      time.seconds.should.equal(0);
    });

    it('could not be created from an empty string', () => {
      let creation = () => timeFactory.fromString('');

      creation.should.throw(Error);
    });

    it('could not be created from a bad formatted string', () => {
      let creation = () => timeFactory.fromString('12:4a:28');

      creation.should.throw(Error);
    });
  });
});
