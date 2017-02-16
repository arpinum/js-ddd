'use strict';

const t = require('tcomb');

function Factory(construction) {
  let {payload} = construction;
  let payloadClone = Object.assign({}, payload);
  return Object.assign({}, construction, {payload: payloadClone});
}

const Creation = t.interface({
  type: t.String,
  payload: t.maybe(t.Object)
});

const Message = t.interface({
  type: t.String,
  payload: t.Object
});

module.exports = t.func(Creation, Message).of(Factory);
