'use strict';

const handlers = {
  CatCreated: (event, cat) => cat.updateWith({age: event.payload.age}),
  CatNamed: (event, cat) => cat.updateWith({name: event.payload.name}),
  FailingEvent: () => {
    throw new Error('bleh');
  },
  CatBirthdateDefined: (event, cat) => cat.updateWith({birthDate: event.payload.birthDate})
};

module.exports = handlers;
