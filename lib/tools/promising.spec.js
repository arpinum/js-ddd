'use strict';

const _ = require('lodash');
const promising = require('./promising');

describe('The promising module', () => {

  context('when promisifying a function with node-like callback', () => {
    it('should resolve the value in callback', () => {
      let func = (callback) => {
        setTimeout(() => {
          callback(null, 'hello');
        });
      };

      let promisified = promising.promisify(func);

      return promisified().should.eventually.equal('hello');
    });

    it('should reject the error in callback', () => {
      let func = (callback) => {
        setTimeout(() => {
          callback(new Error('bleh'));
        });
      };

      let promisified = promising.promisify(func);

      return promisified().should.be.rejectedWith(Error, 'bleh');
    });
  });

  context('when trying a function', () => {
    it('should resolve the immediate value', () => {
      let func = () => 'hello';

      return promising.try(func).should.eventually.equal('hello');
    });

    it('should reject an error', () => {
      let func = () => {
        throw new Error('bleh');
      };

      return promising.try(func).should.be.rejectedWith(Error, 'bleh');
    });

    it('should resolve a resolved value', () => {
      let func = () => new Promise(resolve => setTimeout(() => resolve('hello')));

      return promising.try(func).should.eventually.equal('hello');
    });

    it('should reject a rejection', () => {
      let func = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error('bleh'))));

      return promising.try(func).should.be.rejectedWith(Error, 'bleh');
    });
  });

  context('when mapping', () => {
    it('should resolve when all applied promises are resolved', () => {
      let globalPromise = promising.map([1, 2, 3], x => Promise.resolve(x));

      return globalPromise.should.eventually.deep.equal([1, 2, 3]);
    });

    it('should run promises with regards of concurrency', () => {
      let maxConcurrentRuns = 0;
      let concurrentRuns = 0;
      let func = () => promising.try(() => {
        concurrentRuns++;
        maxConcurrentRuns = Math.max(concurrentRuns, maxConcurrentRuns);
      }).then(() => concurrentRuns--);
      let functions = _.range(50).map(() => func);

      let globalPromise = promising.map(functions, f => f(), {concurrency: 4});

      return globalPromise.then(() => {
        maxConcurrentRuns.should.equal(4);
      });
    });
  });

  context('when mapping in series', () => {
    it('should run promises sequentially', () => {
      let runs = [];
      let functions = [
        () => promising.delay(20).then(() => {
          runs.push('1');
          return '1';
        }),
        () => promising.delay(10).then(() => {
          runs.push('2');
          return '2';
        }),
        () => promising.delay(1).then(() => {
          runs.push('3');
          return '3';
        })
      ];

      let globalPromise = promising.mapSeries(functions, f => f());

      return globalPromise.then(results => {
        results.should.deep.equal(['1', '2', '3']);
        runs.should.deep.equal(['1', '2', '3']);
      });
    });
  });

  context('when delaying', () => {
    it('should resolve after the given ms', () => {
      return promising.delay(1).should.eventually.be.resolved;
    });
  });

  context('when flowing', () => {
    it('should create a promise function of all functions', () => {
      let runs = [];
      let functions = [
        () => promising.delay(1).then(() => {
          runs.push('1');
        }),
        () => promising.delay(1).then(() => {
          runs.push('2');
        })
      ];

      let globalPromise = promising.flow(functions)();

      return globalPromise.then(() => {
        runs.should.deep.equal(['1', '2']);
      });
    });

    it('should preserve order', () => {
      let runs = [];
      let functions = [
        () => promising.delay(20).then(() => {
          runs.push('1');
        }),
        () => promising.delay(1).then(() => {
          runs.push('2');
        })
      ];

      let globalPromise = promising.flow(functions)();

      return globalPromise.then(() => {
        runs.should.deep.equal(['1', '2']);
      });
    });

    it('should supply return value of the previous function to the next', () => {
      let functions = [
        result => promising.delay(1).then(() => [...result, '1']),
        result => promising.delay(1).then(() => [...result, '2']),
        result => promising.delay(1).then(() => [...result, '3'])
      ];

      let globalPromise = promising.flow(functions)(['initial']);

      return globalPromise.then(result => {
        result.should.deep.equal(['initial', '1', '2', '3']);
      });
    });

    it('should handle sync and async functions', () => {
      let functions = [
        result => [...result, '1'],
        result => [...result, '2'],
        result => promising.delay(1).then(() => [...result, '3'])
      ];

      let globalPromise = promising.flow(functions)(['initial']);

      return globalPromise.then(result => {
        result.should.deep.equal(['initial', '1', '2', '3']);
      });
    });
  });
});
