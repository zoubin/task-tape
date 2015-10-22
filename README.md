# task-tape
Tape with [gulp async task support](https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support).

[![npm](https://nodei.co/npm/task-tape.png?downloads=true)](https://www.npmjs.org/package/task-tape)

[![version](https://img.shields.io/npm/v/task-tape.svg)](https://www.npmjs.org/package/task-tape)
[![status](https://travis-ci.org/zoubin/task-tape.svg?branch=master)](https://travis-ci.org/zoubin/task-tape)
[![coverage](https://img.shields.io/coveralls/zoubin/task-tape.svg)](https://coveralls.io/github/zoubin/task-tape)
[![dependencies](https://david-dm.org/zoubin/task-tape.svg)](https://david-dm.org/zoubin/task-tape)
[![devDependencies](https://david-dm.org/zoubin/task-tape/dev-status.svg)](https://david-dm.org/zoubin/task-tape#info=devDependencies)

## Usage

```bash
npm install --save-dev task-tape tape
```

```javascript
var test = require('task-tape');
```

### The normal way

```javascript
test('normal, sync', (t) => {
  t.ok(true);
  t.end();
});

test('normal, plan', (t) => {
  t.plan(2);
  process.nextTick(() => {
    t.ok(true);
  });
  t.ok(true);
});

```

### The gulp task way

```javascript
import sink from 'sink-transform';

test('callback', (t, cb) => {
  process.nextTick(() => {
    t.ok(true);
    cb();
  });
});

test('promise', (t) => {
  return new Promise((rs) => {
    process.nextTick(() => {
      t.ok(true);
      rs();
    });
  });
});

test('promise plan', (t) => {
  t.plan(2);
  t.ok(true);
  return new Promise((rs) => {
    process.nextTick(() => {
      t.ok(true);
      rs();
    });
  });
});

test('stream', (t) => {
  let s = sink.obj((rows, done) => {
    t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ]);
    done();
  });
  s.write({ x: 1 });
  s.write({ y: 2 });
  s.write({ z: 3 });
  process.nextTick(() => {
    s.end();
  });
  return s;
});

```

## t.task(taskCallback)

```javascript
test('tasks', (t) => {
  t.task(() => {
    t.ok(true, 'sync callback');
  });
  t.task((cb) => {
    process.nextTick(() => {
      t.ok(true, 'async callback');
      cb();
    });
  });
  t.task(() => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        t.ok(true, 'return promise');
        resolve();
      });
    });
  });
  t.task(() => {
    let s = sink.obj((rows, done) => {
      t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ], 'return stream');
      done();
    });
    s.write({ x: 1 });
    s.write({ y: 2 });
    s.write({ z: 3 });
    process.nextTick(() => {
      s.end();
    });
    return s;
  });
});

```

