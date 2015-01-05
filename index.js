'use strict';

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
      switch (level) {
        case 'debug': level = 'info'; break;
        case 'fatal': level = 'error'; break;
      }
      console[level].apply(console, arguments);
    };
  });

  return logger;
};
