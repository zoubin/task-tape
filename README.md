# task-tape [![Build Status](https://travis-ci.org/zoubin/task-tape.svg?branch=master)](https://travis-ci.org/zoubin/task-tape)
Tape with [gulp async task support](https://github.com/gulpjs/gulp/blob/master/docs/API.md#async-task-support).

## Usage

[![npm](https://nodei.co/npm/task-tape.png)](https://www.npmjs.org/package/task-tape)

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

