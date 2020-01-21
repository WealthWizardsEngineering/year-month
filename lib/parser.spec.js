const test = require('tape');

const parser = require('./parser');

test('parser', (assert) => {
  assert.plan(1);

  const actual = parser('2020-05');
  assert.deepEqual(actual, ['2020', '05'], 'parses valid input');
});

test('parser', (assert) => {
  assert.plan(1);

  const actual = parser('2020-05-07-08');
  assert.deepEqual(actual, ['2020', '05'], 'parses valid input, discarding extra fields');
});

test('parser', (assert) => {
  assert.plan(1);

  const actual = parser('These-are-not-numbers');
  assert.deepEqual(
    actual,
    ['These', 'are'],
    'parses non-numeric input (upstream code will throw error)'
  );
});

test('parser', (assert) => {
  assert.plan(1);

  const actual = parser('2016');
  assert.deepEqual(actual, ['2016'], 'parses too-short input (upstream code will throw error');
});
