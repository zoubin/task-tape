var test = require('tape')
var concat = require('concat-stream')

test('sync callback', function (t, cb) {
  t.ok(true)
  t.ok(true)
  cb()
})

test('sync callback with t.plan', function (t, cb) {
  t.plan(2)
  t.ok(true)
  t.ok(true)
  cb()
})

test('async callback', function (t, cb) {
  t.ok(true)
  process.nextTick(function () {
    t.ok(true)
    cb()
  })
})

test('async callback with t.plan', function (t, cb) {
  t.plan(2)
  t.ok(true)
  process.nextTick(function () {
    t.ok(true)
    cb()
  })
})

test('promise', function (t) {
  t.ok(true)
  return new Promise(function (rs) {
    process.nextTick(function () {
      t.ok(true)
      rs()
    })
  })
})

test('promise with t.plan', function (t) {
  t.plan(2)
  t.ok(true)
  return new Promise(function (rs) {
    process.nextTick(function () {
      t.ok(true)
      rs()
    })
  })
})

test('stream', function (t) {
  t.ok(true)
  var s = concat({ encoding: 'object' }, function (rows) {
    t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ])
  })
  s.write({ x: 1 })
  s.write({ y: 2 })
  process.nextTick(function () {
    s.end({ z: 3 })
  })
  return s
})

