var runTasks = require('callback-sequence').run
var mix = require('util-mix')

module.exports = function (tape) {
  tape = tape || require('tape')
  mix(tape.Test.prototype, {
    task: task,
    run: run,
  })
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

  var self = this
  this.task(function (cb) {
    var r = self._cb(self, cb)

    // the original sync way
    if (self.calledEnd) {
      return
    }

    // Specify when to end the test
    if (isPromise(r) || isStream(r)) {
      return r
    }
    // test will finish when all tasks finish
    if (self._tasks.length > 1) {
      return cb()
    }

    // either call `cb` or `t.end` to end the test
    // or wait for process.exit
  })

  runTasks(this._tasks, function (err) {
    if (err) {
      // suppress the 'plan !== count' fail caused by the following `this.error(err)`
      self._planError = true
      self.error(err)
    }
    if (!self.calledEnd) {
      self.end()
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

