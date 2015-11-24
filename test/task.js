var test = require('tape')
var sink = require('sink-transform')

test('tasks', function (t) {
  t.plan(5)
  var index = 0
  t.task(function () {
    t.equal(index++, 0, 'sync callback')
  })
  t.task(function (cb) {
    process.nextTick(function () {
      t.equal(index++, 1, 'async callback')
      cb()
    })
  })
  t.task(function () {
    return new Promise(function (resolve) {
      process.nextTick(function () {
        t.equal(index++, 2, 'return promise')
        resolve()
      })
    })
  })
  t.task(function () {
    t.equal(index, 3)
    var s = sink.obj(function (rows, done) {
      t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ], 'return stream')
      done()
    })
    s.write({ x: 1 })
    s.write({ y: 2 })
    process.nextTick(function () {
      s.end({ z: 3 })
    })
    return s
  })
})

test('nested', function (t) {
  t.plan(4)
  var async = function (cb) {
    process.nextTick(function () {
      t.ok(true, 'async callback')
      cb()
    })
  }
  t.task(function () {
    t.ok(true, 'sync callback')
    t.task(async)
  })

  var promise = function () {
    return new Promise(function (resolve) {
      process.nextTick(function () {
        t.ok(true, 'return promise')
        resolve()
      })
    })
  }
  t.task(function () {
    var s = sink.obj(function (rows, done) {
      t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ], 'return stream')
      t.task(promise)
      done()
    })
    s.write({ x: 1 })
    s.write({ y: 2 })
    s.write({ z: 3 })
    process.nextTick(function () {
      s.end()
    })
    return s
  })
})

