const _ = require('lodash');
const t = require('tcomb');
const { createLogger } = require('@arpinum/log');
const { MessageBusContract, LoggerContract } = require('../../types');

const Creation = t.interface(
  {
    eventBus: MessageBusContract,
    options: t.maybe(
      t.interface({
        log: t.maybe(LoggerContract)
      })
    )
  },
  { strict: true }
);

function broadcastEventsDecorator(creation) {
  let { eventBus, options: rawOptions } = Creation(creation);
  let options = _.defaults({}, rawOptions, {
    log: createLogger({ fileName: __filename })
  });

  return result => {
    options.log.debug('Broadcasting events');
    return eventBus.postAll(result.events).then(() => result);
  };
}

module.exports = broadcastEventsDecorator;
