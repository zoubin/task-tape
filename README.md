# task-tape
Tape with [gulpish task support](https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support).

[![npm](https://nodei.co/npm/task-tape.png?downloads=true)](https://www.npmjs.org/package/task-tape)

[![version](https://img.shields.io/npm/v/task-tape.svg)](https://www.npmjs.org/package/task-tape)
[![status](https://travis-ci.org/zoubin/task-tape.svg?branch=master)](https://travis-ci.org/zoubin/task-tape)
[![coverage](https://img.shields.io/coveralls/zoubin/task-tape.svg)](https://coveralls.io/github/zoubin/task-tape)
[![dependencies](https://david-dm.org/zoubin/task-tape.svg)](https://david-dm.org/zoubin/task-tape)
[![devDependencies](https://david-dm.org/zoubin/task-tape/dev-status.svg)](https://david-dm.org/zoubin/task-tape#info=devDependencies)

## Usage

### Install with tape

```bash
npm install --save-dev task-tape tape

```

### Require directly

```javascript
var test = require('task-tape')

```

### Hook require

```javascript
require('task-tape')
var test = require('tape')

```

### With [gulp-tape](https://www.npmjs.com/package/gulp-tape)

```javascript
gulp.task('test', function test() {
  require('task-tape')
  var tape = require('gulp-tape')
  var reporter = require('tap-spec')
  return gulp.src('test/*.js')
    .pipe(tape({
      reporter: reporter(),
    }))
})

```

### npm test

In `package.json`:

```json
{
  "scripts": {
    "test": "task-tape test/*.js"
  }
}

```

To support babel:

```json
{
  "scripts": {
    "test": "task-tape --babel test/*.js"
  }
}

```


## Example

Please check the [example](https://github.com/zoubin/task-tape/tree/master/example) directory.

### The normal way

```javascript
import test from 'tape'
test('normal, sync', (t) => {
  t.ok(true)
  t.end()
})

test('normal, plan', (t) => {
  t.plan(2)
  process.nextTick(() => {
    t.ok(true)
  })
  t.ok(true)
})

```

### The gulp task way

```javascript
import test from 'tape'
import concat from 'concat-stream'
import gulp from 'gulp'
import fs from 'fs'
import del from 'del'

test('callback', (t, cb) => {
  process.nextTick(() => {
    t.ok(true)
    cb()
  })
})

test('promise', (t) => {
  return new Promise((rs) => {
    process.nextTick(() => {
      t.ok(true)
      rs()
    })
  })
})

test('promise plan', (t) => {
  t.plan(2)
  t.ok(true)
  return new Promise((rs) => {
    process.nextTick(() => {
      t.ok(true)
      rs()
    })
  })
})

test('stream', (t) => {
  let s = concat({ encoding: 'object' }, (rows) => {
    t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ])
  })
  s.write({ x: 1 })
  s.write({ y: 2 })
  process.nextTick(() => {
    s.end({ z: 3 })
  })
  return s
})

// Run tasks in sequence.
test('tasks in sequence', function(t) {
  let rows = []

  // clean
  t.task(() => {
    return del('build')
  })

  // collect rows
  t.task(() => {
    let stream = thr.obj()

    stream.write({ index: 0 })

    process.nextTick(() => {
      stream.end({ index: 1 })
    })

    return stream.pipe(concat({ encoding: 'object' }, function (rs) {
      rows = rs.sort((a, b) => {
        return a.index < b.index ? 1 : -1
      })
    }))
  })

  // stringify rows
  t.task(() => {
    t.same(rows, [ { index: 1 }, { index: 0 } ])
    let ws = fs.createWriteStream('rows.json')

    process.nextTick(() => {
      ws.end(JSON.stringify(rows, null, 2))
    })

    return ws
  })

  // build
  t.task(() => {
    return gulp.src('rows.json')
      .pipe(gulp.dest('build'))
  })

  // check
  t.task(() => {
    t.equal(
      fs.readFileSync('rows.json', 'utf8'),
      fs.readFileSync('build/rows.json', 'utf8')
    )
  })

  // clean
  t.task(() => {
    return del('rows.json')
  })
})

```

