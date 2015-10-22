import test from '../lib/main'

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

