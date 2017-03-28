const _ = require('lodash');
const t = require('tcomb');
const {Logger, LoggerContract} = require('@arpinum/log');
const {EventStoreContract} = require('../../types');

const Creation = t.interface({
  eventStore: EventStoreContract,
  options: t.maybe(t.interface({
    log: t.maybe(LoggerContract)
  }))
}, {strict: true});

function addEventsToStoreDecorator(creation) {
  let {eventStore, options: rawOptions} = Creation(creation);
  let options = _.defaults({}, rawOptions, {
    log: new Logger({fileName: __filename})
  });

  return result => {
    options.log.debug('Adding events to store');
    return eventStore.addAll(result.events).then(() => result);
  };
}

module.exports = addEventsToStoreDecorator;
