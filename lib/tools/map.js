'use strict';

function indexArray(array, property) {
  return (array || []).reduce((results, object) => {
    results.set(object[property], object);
    return results;
  }, new Map());
}

module.exports = { indexArray };
