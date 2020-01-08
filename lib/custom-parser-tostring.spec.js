const test = require('tape');
const YearMonth = require('.');

test('custom parser', assert => {
  assert.plan(1);
  const YearMonthWithCustomParser = YearMonth.withParser(s => s.split('/'));
  const yearMonth = YearMonthWithCustomParser.parse('2018/5');

  assert.equals(
    yearMonth.toString(),
    '2018-05',
    'Parses using custom parser');
});

test('custom toString', assert => {
  assert.plan(1);
  const YearMonthWithCustomerFormatter = YearMonth
    .withFormatter((year, month) => `${month}/${year}`);
  const yearMonth = YearMonthWithCustomerFormatter.parse('2018-05');

  assert.equals(
    yearMonth.toString(),
    '5/2018',
    'Uses custom toString()');
});

test('custom parser and formatter together', assert => {
  assert.plan(1);
  const YearMonthWithCustomerFormatter = YearMonth
    .withParser(s => s.split(','))
    .withFormatter((year, month) => `${month},${year}`);
  const yearMonth = YearMonthWithCustomerFormatter.parse('2018,05');

  assert.equals(
    yearMonth.toString(),
    '5,2018',
    'Uses custom toString()');
});
