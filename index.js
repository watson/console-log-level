'use strict'

var util = require('util')

var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
var noop = function () {}

module.exports = function (opts) {
  opts = opts || {}
  opts.level = opts.level || 'info'

  var logger = {}

  var shouldLog = function (level) {
    return levels.indexOf(level) >= levels.indexOf(opts.level)
  }

  levels.forEach(function (level) {
    logger[level] = shouldLog(level) ? log : noop

    function log () {
      var prefix = opts.prefix
      var normalizedLevel

      if (prefix) {
        if (typeof prefix === 'function') prefix = prefix()
        arguments[0] = util.format(prefix, arguments[0])
      }

      if (opts.stderr) return console.error.apply(console, arguments)

      switch (level) {
        case 'trace': normalizedLevel = 'info'; break
        case 'debug': normalizedLevel = 'info'; break
        case 'fatal': normalizedLevel = 'error'; break
        default: normalizedLevel = level
      }

      console[normalizedLevel](util.format.apply(util, arguments))
    }
  })

  return logger
}
