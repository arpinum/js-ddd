'use strict';

const promise = require('./promise');

class MemoryObjectStore {

  constructor() {
    this.innerMap = new Map();
  }

  get(key) {
    return Promise.resolve(this.getSync(key));
  }

  getSync(key) {
    return this.innerMap.get(key);
  }

  set(key, value) {
    return promise.try(() => this.setSync(key, value));
  }

  setSync(key, value) {
    this.innerMap.set(key, value);
  }

  delete(key) {
    this.innerMap.delete(key);
    return Promise.resolve();
  }
}

module.exports = MemoryObjectStore;
