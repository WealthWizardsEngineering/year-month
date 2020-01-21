const test = require('tape');
const R = require('ramda');
const YearMonth = require('.');

test('fromNumbers', (t) => {
  t.test('Valid', (assert) => {
    assert.plan(1);
    const ym = YearMonth.fromNumbers(1960, 2);
    assert.equals(ym.toString(), '1960-02', 'fromNumbers with valid input');
  });

  t.test('Invalid year', (assert) => {
    assert.plan(1);
    assert.throws(
      () => YearMonth.fromNumbers('not a number', 2),
      /Invalid year/,
      'throws error when year is non-numeric string'
    );
  });

  t.test('Non-numeric month', (assert) => {
    assert.plan(1);
    assert.throws(
      () => YearMonth.fromNumbers(2020, 'not a number'),
      /Invalid month/,
      'throws error when month is non-numeric string'
    );
  });

  t.test('Month < 1', (assert) => {
    assert.plan(1);
    assert.throws(
      () => YearMonth.fromNumbers(2020, 0),
      /Invalid month/,
      'throws error when month < 1'
    );
  });

  t.test('Month > 12', (assert) => {
    assert.plan(1);
    assert.throws(
      () => YearMonth.fromNumbers(2020, 13),
      /Invalid month/,
      'throws error when month > 12'
    );
  });
});

test('parse and toString()', (t) => {
  const scenarios = [
    '1970-01',
    '1970-02',
    '1970-12',
    '1971-01',
    '2020-01',
  ];

  scenarios.forEach((formatted) => {
    t.test('parse', (assert) => {
      assert.plan(1);
      const yearMonth = YearMonth.parse(formatted);

      assert.equals(
        yearMonth.toString(),
        formatted,
        `toString(parse(${formatted}) equals (${formatted})`
      );
    });
  });
});

test('Constructed object is frozen', (assert) => {
  // eslint-disable-next-line strict


  assert.plan(1);
  const ym = YearMonth.fromNumbers(1973, 10);
  assert.throws(
    () => { ym.monthNum = 121; },
    /Cannot assign to read only property 'monthNum' of object/,
    'Throws exception when mutation attempted'
  );
});

test('adding months', (t) => {
  const scenarios = [
    ['1970-01', 0, '1970-01'],
    ['1970-01', 1, '1970-02'],
    ['1970-01', 11, '1970-12'],
    ['1970-01', 12, '1971-01'],
    ['2020-01', 5, '2020-06'],
    ['2020-12', 1, '2021-01'],
  ];

  scenarios.forEach(([ym1, addition, ym2]) => {
    t.test('addition', (assert) => {
      assert.plan(1);
      const yearMonth = YearMonth.parse(ym1)
        .addMonths(addition);

      assert.equals(yearMonth.toString(), ym2, `'${ym1}'.addMonths(${addition}) == '${ym2}'`);
    });
    t.test('subtraction', (assert) => {
      assert.plan(1);
      const yearMonth = YearMonth.parse(ym2)
        .addMonths(-addition);

      assert.equals(yearMonth.toString(), ym1, `'${ym2}'.addMonths(${-addition}) == '${ym1}'`);
    });
  });
});

test('adding years', (t) => {
  const scenarios = [
    ['1970-01', 0, '1970-01'],
    ['1970-01', 1, '1971-01'],
    ['1970-01', 10, '1980-01'],
  ];

  scenarios.forEach(([ym1, addition, ym2]) => {
    t.test('addition', (assert) => {
      assert.plan(1);
      const yearMonth = YearMonth.parse(ym1)
        .addYears(addition);

      assert.equals(yearMonth.toString(), ym2, `'${ym1}'.addMonths(${addition}) == '${ym2}'`);
    });
    t.test('subtraction', (assert) => {
      assert.plan(1);
      const yearMonth = YearMonth.parse(ym2)
        .addYears(-addition);

      assert.equals(yearMonth.toString(), ym1, `'${ym2}'.addMonths(${-addition}) == '${ym1}'`);
    });
  });
});

test('equality', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', true],
    ['1970-01', '1970-02', false],
  ];

  scenarios.forEach(([ym1, ym2, expected]) => {
    t.test('addition', (assert) => {
      assert.plan(1);
      const yearMonth1 = YearMonth.parse(ym1);
      const yearMonth2 = YearMonth.parse(ym2);

      assert.equals(yearMonth1.equals(yearMonth2),
        expected,
        `'${ym1}'.equals('${ym2}') is ${expected}`);
    });
  });
});

test('comparison', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', R.equals, 'equal'],
    ['1970-01', '1970-02', R.lt, 'less than'],
    ['1970-01', '1970-12', R.lt, 'less than'],
    ['1970-01', '1971-01', R.lt, 'less than'],
    ['2020-06', '2020-01', R.gt, 'greater than'],
    ['2021-01', '2020-12', R.gt, 'greater than'],
  ];

  scenarios.forEach(([ym1, ym2, fn, description]) => {
    t.test('addition', (assert) => {
      assert.plan(1);
      const yearMonth1 = YearMonth.parse(ym1);
      const yearMonth2 = YearMonth.parse(ym2);

      assert.true(fn(yearMonth1, yearMonth2), `'${ym1}' ${description} '${ym2}'`);
    });
  });
});

test('diff', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', 0],
    ['1970-01', '1970-02', 1],
    ['1970-01', '1970-12', 11],
    ['1970-01', '1971-01', 12],
    ['2020-06', '2020-01', -5],
    ['2021-01', '2020-12', -1],
  ];

  scenarios.forEach(([ym1, ym2, expected]) => {
    t.test('difference', (assert) => {
      assert.plan(1);
      const yearMonth1 = YearMonth.parse(ym1);
      const yearMonth2 = YearMonth.parse(ym2);

      assert.equal(
        yearMonth2.diff(yearMonth1),
        expected,
        `diff('${ym1}', '${ym2}' == '${expected}'`
      );
    });
    t.test('difference', (assert) => {
      assert.plan(1);
      const yearMonth1 = YearMonth.parse(ym1);
      const yearMonth2 = YearMonth.parse(ym2);

      assert.equal(yearMonth2 - yearMonth1, expected, `${ym2} - ${ym1} == '${expected}'`);
    });
  });
});

test('gt', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', false],
    ['1970-02', '1970-01', true],
    ['2020-02', '2019-12', true],
    ['2019-11', '2019-12', false],
    ['2020-03', '2019-12', true],
    ['2020-03', null, true],
  ];

  scenarios.forEach(([now, other, expected]) => {
    t.test('gt', (assert) => {
      assert.plan(1);
      const nowYm = YearMonth.parse(now);
      const otherYm = other === null ? null : YearMonth.parse(other);

      assert.equals(
        nowYm.gt(otherYm),
        expected,
        `'${now}'.gt('${other}') == '${expected}'`
      );
    });
  });
});

test('lt', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', false],
    ['1970-02', '1970-01', false],
    ['2020-02', '2019-12', false],
    ['2019-11', '2019-12', true],
    ['2020-03', null, true],
  ];

  scenarios.forEach(([now, other, expected]) => {
    t.test('lt', (assert) => {
      assert.plan(1);
      const nowYm = YearMonth.parse(now);
      const otherYm = other === null ? null : YearMonth.parse(other);

      assert.equals(
        nowYm.lt(otherYm),
        expected,
        `'${now}'.lt('${other}') == '${expected}'`
      );
    });
  });
});

test('gte', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', true],
    ['1970-02', '1970-01', true],
    ['2020-02', '2019-12', true],
    ['2019-11', '2019-12', false],
    ['2020-03', '2019-12', true],
    ['2020-03', null, true],
  ];

  scenarios.forEach(([now, other, expected]) => {
    t.test('gte', (assert) => {
      assert.plan(1);
      const nowYm = YearMonth.parse(now);
      const otherYm = other === null ? null : YearMonth.parse(other);

      assert.equals(
        nowYm.gte(otherYm),
        expected,
        `'${now}'.gte('${other}') == '${expected}'`
      );
    });
  });
});

test('lte', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', true],
    ['1970-02', '1970-01', false],
    ['2020-02', '2019-12', false],
    ['2019-11', '2019-12', true],
    ['2020-03', null, true],
  ];

  scenarios.forEach(([now, other, expected]) => {
    t.test('lte', (assert) => {
      assert.plan(1);
      const nowYm = YearMonth.parse(now);
      const otherYm = other === null ? null : YearMonth.parse(other);

      assert.equals(
        nowYm.lte(otherYm),
        expected,
        `'${now}'.lte('${other}') == '${expected}'`
      );
    });
  });
});

test('isWithin', (t) => {
  const scenarios = [
    ['1970-01', '1970-01', '1970-01', true],
    ['1970-02', '1970-01', '1970-01', false],
    ['2020-02', '2019-12', '2020-02', true],
    ['2019-11', '2019-12', '2020-02', false],
    ['2020-03', '2019-12', '2020-02', false],
  ];

  scenarios.forEach(([now, from, to, expected]) => {
    t.test('isWithin', (assert) => {
      assert.plan(1);
      const nowYm = YearMonth.parse(now);
      const fromYm = YearMonth.parse(from);
      const toYm = YearMonth.parse(to);

      assert.equals(
        nowYm.isWithin(fromYm, toYm),
        expected,
        `'${now}'.isWithin('${from}', '${to}') == '${expected}'`
      );
    });
  });
});

test('prevMonthOf', (t) => {
  const scenarios = [
    ['2020-04', 4, '2020-04'],
    ['2020-05', 4, '2020-04'],
    ['2020-06', 4, '2020-04'],
    ['2020-12', 4, '2020-04'],
    ['2021-01', 4, '2020-04'],
    ['2021-02', 4, '2020-04'],
    ['2021-03', 4, '2020-04'],
    ['2021-04', 4, '2021-04'],

  ];

  scenarios.forEach(([now, month, expected]) => {
    t.test('prevMonthOf', (assert) => {
      assert.plan(1);
      assert.equals(YearMonth.parse(now).prevMonthOf(month).toString(),
        expected,
        `'${now}'.prevMonthOf('${month}') == '${expected}'`);
    });
  });
});

test('nextMonthOf', (t) => {
  const scenarios = [
    ['2020-04', 4, '2020-04'],
    ['2020-05', 4, '2021-04'],
    ['2020-06', 4, '2021-04'],
    ['2020-12', 4, '2021-04'],
    ['2021-01', 4, '2021-04'],
    ['2021-02', 4, '2021-04'],
    ['2021-03', 4, '2021-04'],
    ['2021-04', 4, '2021-04'],
  ];

  scenarios.forEach(([now, month, expected]) => {
    t.test('nextMonthOf', (assert) => {
      assert.plan(1);
      assert.equals(YearMonth.parse(now).nextMonthOf(month).toString(),
        expected,
        `'${now}'.prevMonthOf('${month}') == '${expected}'`);
    });
  });
});

test('isYearMonth()', (t) => {
  const scenarios = [
    [YearMonth.parse('2020-04'), true, 'YearMonth'],
    [null, false, 'null'],
    ['2020-04', false, 'string'],
    [{}, false, 'arbitrary object'],
  ];

  scenarios.forEach(([obj, expected, description]) => {
    t.test('isYearMonth', (assert) => {
      assert.plan(1);
      assert.equals(
        YearMonth.isYearMonth(obj),
        expected,
        `isYearMonth(${description}) == ${expected}`
      );
    });
  });
});
