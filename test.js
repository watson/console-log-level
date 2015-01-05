'use strict';

var test = require('tape');
var Logger = require('./');

var origInfo = console.info;
var origWarn = console.warn;
var origError = console.error;

var mock = function () {
  console.info = function () { this.infoCalled = true; };
  console.warn = function () { this.warnCalled = true; };
  console.error = function () { this.errorCalled = true; };
};

var restore = function () {
  delete console.infoCalled;
  delete console.warnCalled;
  delete console.errorCalled;
  console.info = origInfo;
  console.warn = origWarn;
  console.error = origError;
};

test('log all', function (t) {
  var logger = Logger({ level: 'debug' });

  mock();
  logger.debug('foo');
  t.ok(console.infoCalled, 'info called');
  t.notOk(console.warnCalled, 'warn not called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  mock();
  logger.info('foo');
  t.ok(console.infoCalled, 'info called');
  t.notOk(console.warnCalled, 'warn not called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  mock();
  logger.warn('foo');
  t.notOk(console.infoCalled, 'info not called');
  t.ok(console.warnCalled, 'warn called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  mock();
  logger.error('foo');
  t.notOk(console.infoCalled, 'info not called');
  t.notOk(console.warnCalled, 'warn not called');
  t.ok(console.errorCalled, 'error called');
  restore();

  mock();
  logger.fatal('foo');
  t.notOk(console.infoCalled, 'info not called');
  t.notOk(console.warnCalled, 'warn not called');
  t.ok(console.errorCalled, 'error called');
  restore();

  t.end();
});

test('default level', function (t) {
  var logger = Logger();

  mock();
  logger.debug('foo');
  t.notOk(console.infoCalled, 'info not called');
  t.notOk(console.warnCalled, 'warn not called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  mock();
  logger.info('foo');
  t.ok(console.infoCalled, 'info called');
  t.notOk(console.warnCalled, 'warn not called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  t.end();
});

test('set custom level', function (t) {
  var logger = Logger({ level: 'warn' });

  mock();
  logger.info('foo');
  t.notOk(console.infoCalled, 'info not called');
  t.notOk(console.warnCalled, 'warn not called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  mock();
  logger.warn('foo');
  t.notOk(console.infoCalled, 'info not called');
  t.ok(console.warnCalled, 'warn called');
  t.notOk(console.errorCalled, 'error not called');
  restore();

  t.end();
});
