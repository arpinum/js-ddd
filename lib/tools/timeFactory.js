'use strict';

const {TypedTimeString} = require('../types');
const Time = require('./Time');

function fromString(string) {
  TypedTimeString(string);
  let [hours, minutes, seconds] = string.split(':').map(s => parseInt(s));
  return Time({
    hours: hours,
    minutes: minutes || 0,
    seconds: seconds || 0
  });
}

module.exports = {
  fromString
};
