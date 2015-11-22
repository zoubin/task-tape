import test from '../lib/main'
import concat from 'concat-stream'

test('sync callback', (t, cb) => {
  t.ok(true)
  t.ok(true)
  cb()
})

test('sync callback with t.plan', (t, cb) => {
  t.plan(2)
  t.ok(true)
  t.ok(true)
  cb()
})

test('async callback', (t, cb) => {
  t.ok(true)
  process.nextTick(() => {
    t.ok(true)
    cb()
  })
})

test('async callback with t.plan', (t, cb) => {
  t.plan(2)
  t.ok(true)
  process.nextTick(() => {
    t.ok(true)
    cb()
  })
})

test('promise', (t) => {
  t.ok(true)
  return new Promise((rs) => {
    process.nextTick(() => {
      t.ok(true)
      rs()
    })
  })
})

test('promise with t.plan', (t) => {
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
  t.ok(true)
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

