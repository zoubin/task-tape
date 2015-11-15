import test from 'tape'
import { precision, toFixed, add } from '../lib/main'
import thr from 'through2'
import concat from 'concat-stream'
import del from 'del'
import fs from 'fs'
import gulp from 'gulp'

test('t.end', function(t) {
  t.equal(
    precision(0),
    0
  )
  t.equal(
    precision(0.1),
    1
  )

  t.end()
})

test('t.plan', function(t) {
  t.plan(3)

  t.equal(
    toFixed(2.385, 2),
    '2.39'
  )
  process.nextTick(() => {
    t.equal(
      toFixed(2.384, 2),
      '2.38'
    )
    t.equal(
      toFixed(2, 2),
      '2.00'
    )
  })
})

test('promise support', function(t) {
  t.equal(
    add(0.34, 0.01),
    0.35
  )
  t.equal(
    add(1.1111, -1.11),
    0.0011
  )
  // the test will end when the returned promise resolves
  return new Promise((rs) => {
    process.nextTick(() => {
      t.equal(
        add(1, 2),
        3
      )
      rs()
    })
  })
})

test('callback support', function(t, cb) {
  process.nextTick(() => {
    t.equal(
      add(0.34, 0.01),
      0.35
    )
    cb()
  })
})

test('stream support', function(t) {
  t.plan(2)
  let count = 0
  let stream = thr.obj(function (row, _, next) {
    t.same(row, { index: count++ })
    next(null, row)
  })
  stream.write({ index: 0 })
  stream.end({ index: 1 })
  return stream
})

test('tasks in sequence', function(t) {
  t.plan(2)

  let rows = []

  // clean
  t.task(() => {
    return del('build')
  })

  // collect rows
  t.task(() => {
    let stream = thr.obj()

    stream.write({ index: 0 })

    process.nextTick(() => {
      stream.end({ index: 1 })
    })

    return stream.pipe(concat({ encoding: 'object' }, function (rs) {
      rows = rs.sort((a, b) => {
        return a.index < b.index ? 1 : -1
      })
    }))
  })

  // stringify rows
  t.task(() => {
    t.same(rows, [ { index: 1 }, { index: 0 } ])
    let ws = fs.createWriteStream('rows.json')

    process.nextTick(() => {
      ws.end(JSON.stringify(rows, null, 2))
    })

    return ws
  })

  // build
  t.task(() => {
    return gulp.src('rows.json')
      .pipe(gulp.dest('build'))
  })

  // check
  t.task(() => {
    t.equal(
      fs.readFileSync('rows.json', 'utf8'),
      fs.readFileSync('build/rows.json', 'utf8')
    )
  })

  // clean
  t.task(() => {
    return del('rows.json')
  })
})

