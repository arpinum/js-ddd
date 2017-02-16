'use strict';

const t = require('tcomb');
const {TypedMessage} = require('../../types');

function Factory(construction) {
  let {payload} = construction;
  let payloadClone = Object.assign({}, payload);
  return Object.assign({}, construction, {payload: payloadClone});
}

const Creation = t.interface({
  type: t.String,
  payload: t.maybe(t.Object)
});

module.exports = t.func(Creation, TypedMessage).of(Factory);
