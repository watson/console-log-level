'use strict'

var util = require('util')

var levels = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal'
].reduce(function (map, level, index) {
  map[level] = index + 1
  return map
}, Object.create(null))

module.exports = function (opts) {
  opts = opts || {}

  var threshold = levels[opts.level] || levels.info

  return Object.keys(levels).reduce(function (logger, level) {
    logger[level] = function () {
      var index = levels[level]
      var prefix = opts.prefix
      var normalizedLevel

      if (index < threshold) return

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
    return logger
  }, Object.create(null))
}
