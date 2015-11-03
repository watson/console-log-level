'use strict'

var util = require('util')

var levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

function guard (idx, msg) {
  if (idx === -1) throw new Error(msg)

  return idx
}

function parseLevel (level) {
  return guard(levels.indexOf(level), 'Unknown log level: ' + level)
}

module.exports = function (opts) {
  var stream, prefix, level

  opts = opts || {}

  if (typeof opts.write === 'function') {
    stream = opts
    prefix = null
    level = parseLevel('info')
  } else {
    stream = opts.stream || process.stderr
    prefix = opts.prefix || null
    level = parseLevel(opts.level || 'info')
  }

  var logger = {}

  levels.forEach(function (localLevel) {
    logger[localLevel] = function () {
      if (parseLevel(localLevel) < level) return

      if (prefix) {
        var format = (typeof prefix === 'function' ? prefix() : prefix)
        arguments[0] = util.format(format, arguments[0])
      }

      stream.write(util.format.apply(util, arguments) + '\n')
    }
  })

  return logger
}
