import Test from 'tape/lib/test';
import { run as runTasks } from 'callback-sequence';

Object.assign(Test.prototype, { task, run });

function task(cb) {
  this._tasks = this._tasks || [];
  this._tasks.push(cb);
}

function isPromise(s) {
  return s && typeof s.then === 'function';
}

function isStream(s) {
  return s && typeof s.pipe === 'function';
}

function run() {
  if (this._skip) {
    return this.end();
  }

  this.emit('prerun');

  this._tasks = this._tasks || [];
  // this._cb is the bound test callback
  // and this._cb.length is always 0,
  // so `runTasks` cannot tell whether it is async
  // but we can assume that a sync test callback must call `.task` or `.end`.
  this._tasks.unshift((cb) => {
    let r = this._cb(this, cb);
    if (isPromise(r) || isStream(r)) {
      return r;
    }
    if (
      this._tasks.length > 1 || // `this.task` called
      this.calledEnd // `this.end` called
    ) {
      cb();
    }
    // async. `cb` must be called by the original test callback
  });

  let planned = false;
  this.once('plan', () => {
    planned = true;
  });

  runTasks(this._tasks, (err) => {
    if (!this.calledEnd && !planned) {
      if (err) {
        this.error(err);
      }
      this.end();
    }
  });
  this.emit('run');
}

export default require('tape');

