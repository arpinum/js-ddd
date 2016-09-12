'use strict';

class MemoryObjectStore {

  constructor() {
    this.innerMap = new Map();
  }

  get(key) {
    return Promise.resolve(this.innerMap.get(key));
  }

  set(key, value) {
    this.innerMap.set(key, value);
    return Promise.resolve();
  }

  delete(key) {
    this.innerMap.delete(key);
    return Promise.resolve();
  }
}

module.exports = MemoryObjectStore;
