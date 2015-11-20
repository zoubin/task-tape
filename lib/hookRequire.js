import { run as runTasks } from 'callback-sequence'
import mix from 'util-mix'

export default function (tape) {
  tape = tape || require('tape')
  mix(tape.Test.prototype, { task, run })
  return tape
}

function task(cb) {
  this._tasks = this._tasks || []
  this._tasks.push(cb)
}

function run() {
  if (this._skip) {
    return this.end()
  }

  this.emit('prerun')

  this._tasks = this._tasks || []
  // this._cb is the bound test callback
  // and this._cb.length is always 0,
  // so `runTasks` cannot tell whether it is async
  // but we can assume that a sync test callback must call `.task` or `.end`.
  this._tasks.unshift((cb) => {
    let r = this._cb(this, cb)
    if (isPromise(r) || isStream(r)) {
      return r
    }
    if (
      this._tasks.length > 1 || // `this.task` called
      this.calledEnd // `this.end` called
    ) {
      cb()
    }
    // async. `cb` must be called by the original test callback
  })

  let planned = false
  this.once('plan', () => {
    planned = true
  })

  runTasks(this._tasks, (err) => {
    if (!this.calledEnd && !planned) {
      if (err) {
        this.error(err)
      }
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

