'use strict';

const t = require('tcomb');
const {TypedTime} = require('../types');

function Factory(construction) {
  let instance = Object.assign(
    {
      hours: 0,
      minutes: 0,
      seconds: 0,
      asHours,
      asMinutes,
      asSeconds,
      asString
    },
    construction);
  return instance;

  function asHours() {
    return instance.asSeconds() / 3600;
  }

  function asMinutes() {
    return instance.asSeconds() / 60;
  }

  function asSeconds() {
    return instance.hours * 3600 + instance.minutes * 60 + instance.seconds;
  }

  function asString() {
    return [instance.hours, instance.minutes, instance.seconds].map(p => withLeading0(p)).join(':');

    function withLeading0(part) {
      return part > 9 ? String(part) : '0' + part;
    }
  }
}

const Creation = t.interface({
  hours: t.maybe(t.Integer),
  minutes: t.maybe(t.Integer),
  seconds: t.maybe(t.Integer)
});

module.exports = t.func(Creation, TypedTime).of(Factory);
