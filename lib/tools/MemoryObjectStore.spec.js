'use strict';

const MemoryObjectStore = require('./MemoryObjectStore');

describe('The memory object store', () => {

  let store;

  beforeEach(() => {
    store = new MemoryObjectStore();
  });

  context('when store contains some objects', () => {
    beforeEach(() => {
      return Promise.all([
        store.set('the_first_key', {first: 'object'}),
        store.set('the_second_key', {second: 'object'})
      ]);
    });

    it('should get the object at the given key', () => {
      let act = store.get('the_first_key');

      return act.should.eventually.deep.equal({first: 'object'});
    });

    it('should delete the object at the given key', () => {
      let act = store.delete('the_first_key');

      return act.then(() => {
        return Promise.all([
          store.get('the_first_key'),
          store.get('the_second_key')
        ]).should.eventually.deep.equal([undefined, {second: 'object'}]);
      });
    });
  });
});
