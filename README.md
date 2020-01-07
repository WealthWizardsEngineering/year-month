# year-month
Simple, fast date calculations with a granularity of one month.

## Install

    $ npm install year-month

...

    const { YearMonth } = require('year-month');

## What is it?

`year-month` is a lightweight library for manipulating dates to a granularity of
one month. `YearMonth` objects are immutable and methods return new instances.

    const weddingMonth = YearMonth.parse('2019-05');
    const goldenAnniversary = weddingMonth.addYears(50);
    console.log(goldenAnniversary); // toString() gives '2069-05'

## Why?

There are several time/date libraries for Javascript. However we had lots of 
application logic that worked at a granularity of one month.

We found that there was a lot of cognitive overhead for the programmer when using a more granular library. For 'Jan 2020', do I use the first day of the month, the
last day or a day in the middle? Midnight? Noon? One minute to midnight? UTC or
local time? Can I just use `thisDate.isBefore(thatDate)` or must I specify 
the monthly granularity?

We also found that the computer was working much harder than it needed to - accounting for the varying number of days in months; handling leap years and leap seconds. If your application doesn't care how long a month is, these are wasted CPU
cycles.

## Month numbers

Months are 1-indexed for both input and output - that is, January is 1, December is 12.

## Instantiate

`YearMonth.fromNumbers(2020, 3)` - March 2020

`YearMonth.parse('2020-03)` - This is the canonical string format

`YearMonth.parse('2020-03-20')` - Day of month is ignored

`YearMonth.parse('2020-03-foobar')` - No really, day of month is ignored

`YearMonth.safeParse('2020-03')` - Equivalent to `parse()` ...

`YearMonth.safeParse(YearMonth.parse('2020-03'))` - ... but if you pass it a `YearMonth`, returns it unchanged.

## Methods

    const ym = YearMonth.parse('2019-05');
    ym.year() // 2019
    ym.month() // 5
    ym.toString() // '2019-05'
    ym.toJSON() // '2019-05'
    ym.addYears(10) // 2029-05
    ym.addMonths(10) // 2020-03
    ym.prevMonthOf(11) // 2018-11
    ym.prevMonthOf(05) // 2019-05 -- prevMonthOf() is inclusive
    ym.nextMonthOf(2) // 2020-02
    ym.nextMonthOf(5) // 2019-05 -- nextMonthOf() is inclusive

## Compare

`YearMonth` implements `equals()` and `valueOf()`.

Among other things this means that `Arrays.sort()`, `<` and `>` etc. work.

The methods `lt()`, `gt()`, `lte()`, `gte()` are equivalent to `<`, `>`, `<=`, `>=`,
*except* that comparisons against `null` are always `true`. That is, `null` represents
'the beginning of time' or 'the end of time' depending on context.

`yd.isWithin(start, end)` is equivalent to  `yd.gte(start) && yd.lte(end)`, 
meaning that `yd.isWithin(null,null)` is `true`. This is useful if you're working
with date ranges which may or may not be open-ended.

JS `===` doesn't use `valueOf()` or `equals()`, so either use `.equals()` explicitly, or use a framework that does (for example Ramda's `equals` or `assert.strictEqual()`)

Subtraction results in the difference in months, but you can also use the `diff()`
method.

    YearMonth.parse('2020-05') - YearMonth.parse('2019-05') // 12
    YearMonth.parse('2020-05').diff(YearMonth.parse('2019-05')) // 12

## Custom parsers and formatters

The ISO-8601 inspired default format of `YYYY-MM` is the **best** format and I promise you'll be happier if you stick with it.

But you can customise your instance of the library with your own parse and format functions.

    // The parser takes a string and returns an array where arr[0] is the year and arr[1] is the month
    const YearMonthWithCustomParser = require('year-month').withParser( s => s.split('/').reverse());
    const ym = YearMonthWithCustomParser.parse('3/2018');
    console.log(ym.toString()); // "2018-03"

    // formatter takes numbers (year, month) and returns a string
    const YearMonthWithCustomFormat = require('year-month').withFormatter( (year, month) => `${month}/${year`});
    console.log(YearMonthWithCustomFormat.parse('2019-05').toString()); // "5/2019"

    // you can chain these
    const MyCustomYearMonth = require('year-month').withParser(myParser).withFormatter(myFormatter);

---

Created by Wealth Wizards Software Engineering
