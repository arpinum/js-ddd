'use strict';

require('chai').should();
const FakeResponse = require('../../test/FakeResponse');
const unhandledErrorMiddleware = require('./unhandledErrorMiddleware');
const TechnicalError = require('../../errors/generic/TechnicalError');
const FunctionalError = require('../../errors/generic/FunctionalError');
const ClientError = require('../../errors/web/ClientError');
const EntityNotFoundError = require('../../errors/EntityNotFoundError');
const QueriedObjectNotFoundError = require('../../errors/QueriedObjectNotFoundError');

describe('The unhandled error middleware', () => {

  let middleware;
  let response;

  beforeEach(() => {
    middleware = unhandledErrorMiddleware();
    response = new FakeResponse();
  });

  it('should send a server error by default', () => {
    let error = new Error('the error');
    let middleware = unhandledErrorMiddleware({verboseWebErrors: true});

    middleware(error, null, response);

    response.status.should.have.been.calledWith(500);
    errorSentIs({
      error: {
        message: 'the error',
        code: 500
      }
    });
  });

  it('should hide the detailed message based on configuration', () => {
    let error = new TechnicalError('very technical message');
    error.uselessDetails = 'very useless for user';
    let middleware = unhandledErrorMiddleware({verboseWebErrors: false});

    middleware(error, null, response);

    errorSentIs({
      error: {
        message: 'Server error',
        code: 500
      }
    });
  });

  it('should send a client error for functionnal errors', () => {
    let error = new FunctionalError('badaboom');

    middleware(error, null, response);

    response.status.should.have.been.calledWith(400);
    errorSentIs({
      error: {
        message: 'badaboom',
        code: 400
      }
    });
  });

  it('should preserve data stored in errors', () => {
    let error = new FunctionalError('badaboom');
    error.data = {the: 'data'};
    error.info = 3;

    middleware(error, null, response);

    response.status.should.have.been.calledWith(400);
    errorSentIs({
      error: {
        message: 'badaboom',
        data: {the: 'data'},
        info: 3,
        code: 400
      }
    });
  });

  it('should send a 404 for an entity not found error', () => {
    let error = new EntityNotFoundError({id: '33'});

    middleware(error, null, response);

    response.status.should.have.been.calledWith(404);
    let message = 'No entity for ' + JSON.stringify({id: '33'});
    errorSentIs({
      error: {message: message, code: 404}
    });
  });

  it('should send a 404 for a queried object not found error', () => {
    let error = new QueriedObjectNotFoundError({id: '33'});

    middleware(error, null, response);

    response.status.should.have.been.calledWith(404);
    let message = 'Queried object not found for ' + JSON.stringify({id: '33'});
    errorSentIs({
      error: {
        message: message,
        code: 404
      }
    });
  });

  it('should send the provided error code if present', () => {
    let error = new ClientError('not found', 404);

    middleware(error, null, response);

    response.status.should.have.been.calledWith(404);
    errorSentIs({
      error: {
        message: 'not found',
        code: 404
      }
    });
  });

  function errorSentIs(expected) {
    let error = response.send.lastCall.args[0];
    error.should.deep.equal(expected);
  }
});
