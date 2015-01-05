# console-log-level

A dead simple logger. Will log to STDOUT or STDERR depending on the
chosen log level. It uses `console.info`, `console.warn` and
`console.error` and hence supports the same API.

Log levels supported: debug, info, warn, error and fatal (defaults to
'info').

[![build status](https://secure.travis-ci.org/watson/console-log-level.png)](http://travis-ci.org/watson/console-log-level)

## Installation

```
npm install console-log-level
```

## Example usage

```js
var log = require('console-log-level')({ level: 'info' });

log.debug('a'); // will not do anything
log.info('b');  // will output 'b\n' on STDOUT
log.warn('c');  // will output 'c\n' on STDERR
log.error('d'); // will output 'd\n' on STDERR
log.fatal('e'); // will output 'e\n' on STDERR
```

## License

MIT
