import { run as runTasks } from 'callback-sequence'
import mix from 'util-mix'

module.exports = function (tape) {
  tape = tape || require('tape')
  mix(tape.Test.prototype, { task, run })
  return tape
}

function task(cb) {
  this._tasks = this._tasks || []
  this._tasks.push(cb)
}

function run() {
  if (!this._cb || this._skip) {
    return this.end()
  }

  this.emit('prerun')

  this.task((cb) => {
    let r = this._cb(this, cb)

    // the original sync way
    if (this.calledEnd) {
      return
    }

    // Specify when to end the test
    if (isPromise(r) || isStream(r)) {
      return r
    }
    // test will finish when all tasks finish
    if (this._tasks.length > 1) {
      return cb()
    }

    // either call `cb` or `t.end` to end the test
    // or wait for process.exit
  })

  runTasks(this._tasks, (err) => {
    if (err) {
      // suppress the 'plan !== count' fail caused by the following `this.error(err)`
      this._planError = true
      this.error(err)
    }
    if (!this.calledEnd) {
      this.end()
    }
  })
  this.emit('run')
}

function isPromise(s) {
  return s && typeof s.then === 'function'
}

function isStream(s) {
  return s && typeof s.pipe === 'function'
}

