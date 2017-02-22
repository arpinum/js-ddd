const t = require('tcomb');
const MessageContract = require('./messageContract');

const EventContract = MessageContract.extend({
  date: t.Date
}, {name: 'EventContract'});

module.exports = EventContract;
