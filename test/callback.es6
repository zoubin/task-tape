import test from '../lib/main';
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

