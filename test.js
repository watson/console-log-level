'use strict'

var test = require('tape')
var PassThrough = require('stream').PassThrough

var Logger = require('./')

test('log all', function (t) {
  var stream = new PassThrough()
  var logger = Logger({ level: 'trace', stream: stream })

  logger.trace('foo')
  t.equal(stream.read().toString(), 'foo\n')

  logger.debug('foo')
  t.equal(stream.read().toString(), 'foo\n')

  logger.info('foo')
  t.equal(stream.read().toString(), 'foo\n')

  logger.warn('foo')
  t.equal(stream.read().toString(), 'foo\n')

  logger.error('foo')
  t.equal(stream.read().toString(), 'foo\n')

  logger.fatal('foo')
  t.equal(stream.read().toString(), 'foo\n')

  t.end()
})

test('default level', function (t) {
  var stream = new PassThrough()
  var logger = Logger(stream)

  logger.trace('foo')
  t.equal(stream.read(), null)

  logger.debug('foo')
  t.equal(stream.read(), null)

  logger.info('foo')
  t.equal(stream.read().toString(), 'foo\n')

  t.end()
})

test('set custom level', function (t) {
  var stream = new PassThrough()
  var logger = Logger({ level: 'warn', stream: stream })

  logger.info('foo')
  t.equal(stream.read(), null)

  logger.warn('foo')
  t.equal(stream.read().toString(), 'foo\n')

  t.end()
})

test('set prefix', function (t) {
  var now = new Date().toISOString()
  var stream = new PassThrough()
  var logger = Logger({ prefix: now, stream: stream })
  var msg = 'bar'

  logger.info('foo %s', msg)
  t.equal(stream.read().toString(), now + ' foo bar\n')

  logger.warn('foo %s', msg)
  t.equal(stream.read().toString(), now + ' foo bar\n')

  logger.error('foo %s', msg)
  t.equal(stream.read().toString(), now + ' foo bar\n')

  t.end()
})

test('set prefix with function', function (t) {
  var count = 0
  var stream = new PassThrough()
  var prefix = function () { return String(++count) }
  var logger = Logger({ prefix: prefix, stream: stream })
  var msg = 'bar'

  logger.info('foo %s', msg)
  t.equal(stream.read().toString(), '1 foo bar\n')

  logger.warn('foo %s', msg)
  t.equal(stream.read().toString(), '2 foo bar\n')

  logger.error('foo %s', msg)
  t.equal(stream.read().toString(), '3 foo bar\n')

  t.end()
})
