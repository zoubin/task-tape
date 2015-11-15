import test from '../lib/main'
import concat from 'concat-stream'

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
  s.write({ z: 3 })
  process.nextTick(() => {
    s.end()
  })
  return s
})

