var test = require('tape')

test('sync t.end', function (t) {
  t.ok(true)
  t.end()
})

test('sync t.plan', function (t) {
  t.plan(2)
  t.ok(true)
  t.ok(true)
})

test('async t.end', function (t) {
  t.ok(true)
  process.nextTick(function () {
    t.ok(true)
    t.end()
  })
})

test('async t.plan', function (t) {
  t.plan(2)
  process.nextTick(function () {
    t.ok(true)
  })
  t.ok(true)
})

test('no callback')

test.skip('t.skip', function () {
  throw new Error('Not Skipped')
})

