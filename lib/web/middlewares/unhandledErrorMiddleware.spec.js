'use strict';

const sinon = require('sinon');
const {FakeResponse} = require('../../test');
const {
  AuthorizationError,
  FunctionalError,
  TechnicalError,
  QueriedObjectNotFoundError,
  EntityNotFoundError,
  ClientError,
  ServerError,
  ForbiddenError,
  ResourceNotFoundError
} = require('../../errors');
const unhandledErrorMiddleware = require('./unhandledErrorMiddleware');

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

    sinon.assert.calledWith(response.status, 500);
    errorSentIs(new ServerError('the error'));
  });

  it('should hide the detailed message based on configuration', () => {
    let error = new TechnicalError('very technical message');
    error.uselessDetails = 'very useless for user';
    let middleware = unhandledErrorMiddleware({verboseWebErrors: false});

    middleware(error, null, response);

    errorSentIs(new ServerError());
  });

  it('should send a client error for functionnal errors', () => {
    let error = new FunctionalError('badaboom');

    middleware(error, null, response);

    sinon.assert.calledWith(response.status, 400);
    errorSentIs(new ClientError('badaboom', 400));
  });

  it('should preserve data stored in errors', () => {
    let error = Object.assign(new FunctionalError('badaboom'), {data: {the: 'data'}, info: 3});

    middleware(error, null, response);

    sinon.assert.calledWith(response.status, 400);
    let expected = Object.assign(new ClientError('badaboom'), {data: {the: 'data'}, info: 3});
    errorSentIs(expected);
  });

  it('should send a 404 for an entity not found error', () => {
    let error = new EntityNotFoundError({id: '33'});

    middleware(error, null, response);

    sinon.assert.calledWith(response.status, 404);
    let message = `No entity for ${JSON.stringify({id: '33'})}`;
    errorSentIs(new ResourceNotFoundError(message));
  });

  it('should send a 404 for a queried object not found error', () => {
    let error = new QueriedObjectNotFoundError({id: '33'});

    middleware(error, null, response);

    sinon.assert.calledWith(response.status, 404);
    let message = `Queried object not found for ${JSON.stringify({id: '33'})}`;
    errorSentIs(new ResourceNotFoundError(message));
  });

  it('should send a 403 for an authorization error', () => {
    let error = new AuthorizationError('You cannot!');

    middleware(error, null, response);

    sinon.assert.calledWith(response.status, 403);
    errorSentIs(new ForbiddenError('You cannot!'));
  });

  it('should send the provided error code if present', () => {
    let error = new ClientError('not found', 404);

    middleware(error, null, response);

    sinon.assert.calledWith(response.status, 404);
    errorSentIs(new ClientError('not found', 404));
  });

  function errorSentIs(expected) {
    let error = response.send.lastCall.args[0].error;
    error.should.be.instanceOf(expected.constructor);
    Object.assign({}, error).should.deep.equal(Object.assign({}, expected));
  }
});
