import test from '../lib/main'

test('sync t.end', (t) => {
  t.ok(true)
  t.end()
})

test('sync t.plan', (t) => {
  t.plan(2)
  t.ok(true)
  t.ok(true)
})

test('async t.end', (t) => {
  t.ok(true)
  process.nextTick(() => {
    t.ok(true)
    t.end()
  })
})

test('async t.plan', (t) => {
  t.plan(2)
  process.nextTick(() => {
    t.ok(true)
  })
  t.ok(true)
})

test('no callback')

test.skip('t.skip', () => {
  throw new Error('Not Skipped')
})

