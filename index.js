'use strict'

var util = require('util')

var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
var noop = function () {}

module.exports = function (opts) {
  opts = opts || {}
  opts.level = opts.level || 'info'
  var levelMap = opts.levelMap || {
    'trace': 'info',
    'debug': 'info',
    'fatal': 'error'
  }

  var logger = {}

  var shouldLog = function (level) {
    return levels.indexOf(level) >= levels.indexOf(opts.level)
  }

  levels.forEach(function (level) {
    var normalizedLevel

    if (opts.stderr) {
      normalizedLevel = 'error'
    } else {
      normalizedLevel = level in levelMap ? levelMap[level] : level
    }
    if (normalizedLevel) {
      logger[level] = shouldLog(level) ? log : noop
    }

    function log () {
      var prefix = opts.prefix

      if (prefix) {
        if (typeof prefix === 'function') prefix = prefix(level)
        arguments[0] = util.format(prefix, arguments[0])
      }

      console[normalizedLevel](util.format.apply(util, arguments))
    }
  })

  return logger
}
