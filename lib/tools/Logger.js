'use strict';

const _ = require('lodash');
const path = require('path');

const levels = ['all', 'trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark', 'off'];

class Logger {

  constructor(options) {
    let _options = _.defaults({}, options,
      {level: process.env.ENGINE__LOG_LEVEL},
      {level: 'info', consoleLog: console.log});

    let priority = priorityFrom(_options.level);

    for (let level of levels) {
      this[level] = createLoggerMessageFunc(level);
    }

    function createLoggerMessageFunc(level) {
      let currentPriority = priorityFrom(level);
      return (...args) => {
        if (priority <= currentPriority) {
          _options.consoleLog(`${date()} - ${level}: [${category()}]`, ...args);
        }
      };
    }

    function priorityFrom(level) {
      return levels.indexOf(level.toLowerCase());
    }

    function date() {
      return new Date().toISOString();
    }

    function category() {
      return _options.fileName
        ? path.basename(_options.fileName, path.extname(_options.fileName))
        : 'default';
    }
  }
}

module.exports = Logger;
