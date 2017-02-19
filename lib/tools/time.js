'use strict';

const t = require('tcomb');
const {TypedTimeString} = require('../types');

const Creation = t.interface({
  hours: t.maybe(t.Integer),
  minutes: t.maybe(t.Integer),
  seconds: t.maybe(t.Integer)
});

class Time {

  constructor(creation = {}) {
    Object.assign(this, {hours: 0, minutes: 0, seconds: 0}, Creation(creation));
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
    TypedTimeString(string);
    let [hours, minutes, seconds] = string.split(':').map(s => parseInt(s));
    return new Time({
      hours: hours,
      minutes: minutes || 0,
      seconds: seconds || 0
    });
  }
}

module.exports = {Time};
