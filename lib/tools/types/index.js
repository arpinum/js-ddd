'use strict';

const t = require('tcomb');
const {TimeType, TimeString} = require('./time');

// eslint-disable-next-line max-len
const iso8601Regex = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const Iso8601DateString = t.refinement(t.String, s => iso8601Regex.test(s), 'Iso8601DateString');

const integerRegex = /^(?:[-+]?(?:0|[1-9][0-9]*))$/;
const IntegerString = t.refinement(t.String, s => integerRegex.test(s), 'IntegerString');

const Geolocation = t.struct({
  latitude: t.Number,
  longitude: t.Number
});

module.exports = {
  Iso8601DateString,
  IntegerString,
  Geolocation,
  TimeType,
  TimeString
};
