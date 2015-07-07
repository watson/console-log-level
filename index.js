'use strict';

var util = require('util');

var levels = ['debug', 'info', 'warn', 'error', 'fatal'];

module.exports = function (opts) {
  opts = opts || {};
  opts.level = opts.level || 'info';

  var logger = {};

  var shouldLog = function (level) {
    return levels.indexOf(level) >= levels.indexOf(opts.level);
  };

  levels.forEach(function (level) {
    logger[level] = function () {
      if (!shouldLog(level)) return;

      var prefix = opts.prefix;

      switch (level) {
        case 'debug': level = 'info'; break;
        case 'fatal': level = 'error'; break;
      }

      if (prefix) {
        if (typeof prefix === 'function') prefix = prefix();
        arguments[0] = util.format(prefix, arguments[0]);
      }

      console[level].apply(console, arguments);
    };
  });

  return logger;
};
