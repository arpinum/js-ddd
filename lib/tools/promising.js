'use strict';

const _ = require('lodash');

function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

function doTry(func) {
  return new Promise((resolve, reject) => {
    try {
      let result = func();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

function map(values, func, options) {
  let opts = _.defaults({}, options, {concurrency: 3});
  let resolvers = [];
  let wrappedRuns = [];
  for (let value of values) {
    let wrappedRun = new Promise(resolve => resolvers.push(resolve))
      .then(() => func(value))
      .then(result => {
        runNextPromise();
        return result;
      });
    wrappedRuns.push(wrappedRun);
  }
  _.range(opts.concurrency).forEach(runNextPromise);
  return Promise.all(wrappedRuns);

  function runNextPromise() {
    if (resolvers.length > 0) {
      resolvers[0]();
      resolvers.shift();
    }
  }
}

function mapSeries(values, func) {
  return map(values, func, {concurrency: 1});
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = {
  promisify,
  try: doTry,
  map,
  mapSeries,
  delay
};
