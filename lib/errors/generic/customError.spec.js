'use strict';

const CustomError = require('./customError');

class MyError extends CustomError {
}

describe('A custom error', () => {

  it('can have a message', () => {
    let error = new CustomError('Error happened');

    error.message.should.equal('Error happened');
  });

  it('should expose concrete error name', () => {
    let error = new MyError();

    error.name = 'MyError';
  });
});
