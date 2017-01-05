'use strict';

const t = require('tcomb');
const validate = require('../validate');

const timeRegex = /^\d{2}(:\d{2}(:\d{2})?)?$/;
const TimeString = t.refinement(t.String, s => timeRegex.test(s), 'TimeString');

class Time {

  constructor(information) {
    validate(information).isA(t.struct({
      hours: t.Integer,
      minutes: t.Integer,
      seconds: t.Integer
    }, {strict: true}));
    Object.assign(this, information);
  }

  asHours() {
    return this.asSeconds() / 3600;
  }

  asMinutes() {
    return this.asSeconds() / 60;
  }

  asSeconds() {
    return this.hours * 3600 + this.minutes * 60 + this.seconds;
  }

  static fromString(string) {
    validate(string).isA(TimeString);
    let [hours, minutes, seconds] = string.split(':').map(s => parseInt(s));
    return new Time({
      hours: hours,
      minutes: minutes || 0,
      seconds: seconds || 0
    });
  }
}

const TimeType = t.irreducible('TimeType', (x) => x instanceof Time);

module.exports = {Time, TimeType, TimeString};
