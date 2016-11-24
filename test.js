'use strict'

var test = require('tape')
var Logger = require('./')

var origInfo = console.info
var origWarn = console.warn
var origError = console.error

var mock = function () {
  console.info = function () { this.infoCalled = true }
  console.warn = function () { this.warnCalled = true }
  console.error = function () { this.errorCalled = true }
}

var restore = function () {
  delete console.infoCalled
  delete console.warnCalled
  delete console.errorCalled
  console.info = origInfo
  console.warn = origWarn
  console.error = origError
}

var spyOn = function (method, spy) {
  console['~' + method] = console[method]
  console[method] = spy
}

var spyOff = function (method) {
  console[method] = console['~' + method]
  delete console['~' + method]
}

test('log all', function (t) {
  var logger = Logger({ level: 'trace' })

  mock()
  logger.trace('foo')
  t.ok(console.infoCalled, 'info called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.debug('foo')
  t.ok(console.infoCalled, 'info called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.info('foo')
  t.ok(console.infoCalled, 'info called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.warn('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.ok(console.warnCalled, 'warn called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.error('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  mock()
  logger.fatal('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  t.end()
})

test('log all to stderr', function (t) {
  var logger = Logger({ level: 'trace', stderr: true })

  mock()
  logger.trace('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  mock()
  logger.debug('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  mock()
  logger.info('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  mock()
  logger.warn('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  mock()
  logger.error('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  mock()
  logger.fatal('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.ok(console.errorCalled, 'error called')
  restore()

  t.end()
})

test('default level', function (t) {
  var logger = Logger()

  mock()
  logger.trace('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.debug('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.info('foo')
  t.ok(console.infoCalled, 'info called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  t.end()
})

test('set custom level', function (t) {
  var logger = Logger({ level: 'warn' })

  mock()
  logger.info('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.notOk(console.warnCalled, 'warn not called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  mock()
  logger.warn('foo')
  t.notOk(console.infoCalled, 'info not called')
  t.ok(console.warnCalled, 'warn called')
  t.notOk(console.errorCalled, 'error not called')
  restore()

  t.end()
})

test('set prefix', function (t) {
  var now = new Date().toISOString()
  var logger = Logger({ prefix: now })
  var args = (function () { return arguments })(now + ' foo bar')

  spyOn('info', function () {
    spyOff('info')
    t.deepEqual(arguments, args, 'arguments ok')
  })

  spyOn('warn', function () {
    spyOff('warn')
    t.deepEqual(arguments, args, 'arguments ok')
  })

  spyOn('error', function () {
    spyOff('error')
    t.deepEqual(arguments, args, 'arguments ok')
    t.end()
  })

  logger.info('foo %s', 'bar')
  logger.warn('foo %s', 'bar')
  logger.error('foo %s', 'bar')
})

test('set prefix with function', function (t) {
  var now = new Date().toISOString()
  var logger = Logger({ prefix: function () { return now } })
  var args = (function () { return arguments })(now + ' foo bar')

  spyOn('info', function () {
    spyOff('info')
    t.deepEqual(arguments, args, 'arguments ok')
  })

  spyOn('warn', function () {
    spyOff('warn')
    t.deepEqual(arguments, args, 'arguments ok')
  })

  spyOn('error', function () {
    spyOff('error')
    t.deepEqual(arguments, args, 'arguments ok')
    t.end()
  })

  logger.info('foo %s', 'bar')
  logger.warn('foo %s', 'bar')
  logger.error('foo %s', 'bar')
})
