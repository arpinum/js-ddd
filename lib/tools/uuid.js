'use strict';

const uuid = require('node-uuid');

const regex = /.{8}-.{4}-.{4}-.{4}-.{12}/;

let fixedUuid;

function fix(uuid) {
  fixedUuid = uuid;
}

function reset() {
  fixedUuid = null;
}

function create() {
  if (fixedUuid) {
    return fixedUuid;
  }
  return uuid.v4();
}

module.exports = {
  create,
  regex,
  fix,
  reset
};
