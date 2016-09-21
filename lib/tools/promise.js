'use strict';

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

module.exports = {
  promisify,
  try: doTry
};
