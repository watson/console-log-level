'use strict'

var util = require('util')

var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

module.exports = function (opts) {
  var stream, prefix

  opts = opts || {}

  if (typeof opts.write === 'function') {
    stream = opts
    prefix = null
    opts = { level: 'info' }
  } else {
    opts.level = opts.level || 'info'
    stream = opts.stream || process.stderr
    prefix = opts.prefix || null
  }

  var logger = {}

  var shouldLog = function (level) {
    return levels.indexOf(level) >= levels.indexOf(opts.level)
  }

  levels.forEach(function (level) {
    logger[level] = function () {
      if (!shouldLog(level)) return

      if (prefix) {
        var format = (typeof prefix === 'function' ? prefix() : prefix)
        arguments[0] = util.format(format, arguments[0])
      }

      stream.write(util.format.apply(util, arguments) + '\n')
    }
  })

  return logger
}
