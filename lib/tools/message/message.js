'use strict';

const t = require('tcomb');

const Creation = t.interface({
  type: t.String,
  payload: t.maybe(t.Object)
});

class Message {

  constructor(creation) {
    let {payload} = Creation(creation);
    let payloadClone = Object.assign({}, payload);
    Object.assign(this, creation, {payload: payloadClone});
  }
}

module.exports = {Message};
