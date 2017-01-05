'use strict';

const t = require('tcomb');
const validate = require('../validate');

const timeRegex = /^\d{2}(:\d{2}(:\d{2})?)?$/;
const TimeString = t.refinement(t.String, s => timeRegex.test(s), 'TimeString');

class Time {

  constructor(information) {
    validate(information).isA(t.struct({
      hours: t.maybe(t.Integer),
      minutes: t.maybe(t.Integer),
      seconds: t.maybe(t.Integer)
    }, {strict: true}));
    Object.assign(this, {hours: 0, minutes: 0, seconds: 0}, information);
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

  asString() {
    return [this.hours, this.minutes, this.seconds].map(p => withLeading0(p)).join(':');

    function withLeading0(part) {
      return part > 9 ? String(part) : '0' + part;
    }
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
