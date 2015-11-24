var test = require('tape')

test('only', function (t) {
  var count = 0
  test('first', function (tt) {
    tt.equal(++count, 1)
    tt.end()
  })
  test.only('second', function (tt) {
    tt.equal(++count, 1)
    tt.end()
  })
  t.end()
})
