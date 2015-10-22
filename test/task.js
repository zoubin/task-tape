import test from '../lib/main'
import sink from 'sink-transform'

test('tasks', (t) => {
  t.task(() => {
    t.ok(true, 'sync callback')
  })
  t.task((cb) => {
    process.nextTick(() => {
      t.ok(true, 'async callback')
      cb()
    })
  })
  t.task(() => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        t.ok(true, 'return promise')
        resolve()
      })
    })
  })
  t.task(() => {
    let s = sink.obj((rows, done) => {
      t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ], 'return stream')
      done()
    })
    s.write({ x: 1 })
    s.write({ y: 2 })
    s.write({ z: 3 })
    process.nextTick(() => {
      s.end()
    })
    return s
  })
})

test('nested', (t) => {
  let async = (cb) => {
    process.nextTick(() => {
      t.ok(true, 'async callback')
      cb()
    })
  }
  t.task(() => {
    t.ok(true, 'sync callback')
    t.task(async)
  })

  let promise = () => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        t.ok(true, 'return promise')
        resolve()
      })
    })
  }
  t.task(() => {
    let s = sink.obj((rows, done) => {
      t.same(rows, [ { x: 1 }, { y: 2 }, { z: 3 } ], 'return stream')
      t.task(promise)
      done()
    })
    s.write({ x: 1 })
    s.write({ y: 2 })
    s.write({ z: 3 })
    process.nextTick(() => {
      s.end()
    })
    return s
  })
})
