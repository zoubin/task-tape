import test from '../lib/main';

test('only', (t) => {
  let count = 0;
  test('first', (tt) => {
    tt.equal(++count, 1);
    tt.end();
  });
  test.only('second', (tt) => {
    tt.equal(++count, 1);
    tt.end();
  });
  t.end();
});
