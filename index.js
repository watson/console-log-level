'use strict'

var util = require('util')

var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

module.exports = function (opts) {
  opts = opts || {}
  opts.level = opts.level || 'info'

  var logger = {}

  var shouldLog = function (level) {
    return levels.indexOf(level) >= levels.indexOf(opts.level)
  }

  levels.forEach(function (level) {
    logger[level] = function () {
      if (!shouldLog(level)) return

      var prefix = opts.prefix
      var normalizedLevel

      switch (level) {
        case 'trace': normalizedLevel = 'info'; break
        case 'debug': normalizedLevel = 'info'; break
        case 'fatal': normalizedLevel = 'error'; break
        default: normalizedLevel = level
      }

      if (prefix) {
        if (typeof prefix === 'function') prefix = prefix()
        arguments[0] = util.format(prefix, arguments[0])
      }

      console[normalizedLevel].apply(console, arguments)
    }
  })

  return logger
}
