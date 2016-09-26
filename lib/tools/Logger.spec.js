'use strict';

const sinon = require('sinon');
const Logger = require('./Logger');

describe('The logger', () => {

  let consoleSpy;

  beforeEach(() => {
    consoleSpy = {log: sinon.spy()};
  });

  it('should log via consoleSpy', () => {
    let logger = new Logger({
      level: 'info',
      consoleLog: (...args) => consoleSpy.log(...args)
    });

    logger.info('the message');

    assertLoggedMessageIs('the message');
  });

  it('should log if logger priority is greater than given one', () => {
    let logger = new Logger({
      level: 'debug',
      consoleLog: (...args) => consoleSpy.log(...args)
    });

    logger.error('the message');

    assertLoggedMessageIs('the message');
  });

  it('wont log if logger priority is smaller than given one', () => {
    let logger = new Logger({
      level: 'error',
      consoleLog: (...args) => consoleSpy.log(...args)
    });

    logger.debug('the message');

    consoleSpy.log.should.not.have.been.called;
  });

  it('should log prefixing the message with category based on file name', () => {
    let logger = new Logger({
      level: 'info',
      fileName: 'the/file.js',
      consoleLog: (...args) => consoleSpy.log(...args)
    });

    logger.info('the message');

    assertLoggedPrefixIncludes(['[file]']);
  });

  function assertLoggedMessageIs(message) {
    consoleSpy.log.should.have.been.called;
    consoleSpy.log.lastCall.args[1].should.equal(message);
  }

  function assertLoggedPrefixIncludes(prefix) {
    consoleSpy.log.should.have.been.called;
    consoleSpy.log.lastCall.args[0].should.includes(prefix);
  }
});
