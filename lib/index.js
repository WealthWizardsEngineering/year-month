const DEFAULT_PARSER = require('./parser');

const YEAR_ZERO = 1970;

const DEFAULT_FORMATTER = (year, month) => {
  const yearString = `${year}`.padStart(4, '0');
  const monthString = `${month}`.padStart(2, '0');
  return `${yearString}-${monthString}`;
};

const throwForWrongType = o => {
  // eslint-disable-next-line no-use-before-define
  if (! (o instanceof YearMonth)) {
    throw new Error('object is not an instance of YearMonth');
  }
};

const throwForWrongTypeAllowingNull = o => {
  if (o === null || o === undefined) { return; }
  throwForWrongType(o);
};

const mod = (n, m) => ((n % m) + m) % m;
class YearMonth {
  constructor(monthNum, factory) {
    this.monthNum = monthNum;
    this.factory = factory;
    Object.freeze(this);
  }

  year() {
    return Math.floor(this.monthNum / 12) + YEAR_ZERO;
  }

  month() {
    return mod(this.monthNum, 12) + 1;
  }

  toString() {
    return this.factory.formatter(this.year(), this.month());
  }

  toJSON() {
    return this.toString();
  }

  addMonths(months) {
    return new YearMonth(this.monthNum + months, this.factory);
  }

  addYears(years) {
    return this.addMonths(years * 12);
  }

  valueOf() {
    return this.monthNum;
  }

  equals(that) {
    return (that instanceof YearMonth) && this.valueOf() === that.valueOf();
  }

  diff(that) {
    throwForWrongType(that);
    return this.valueOf() - that.valueOf();
  }

  gt(that) {
    throwForWrongTypeAllowingNull(that);
    return !that || this.valueOf() > that.valueOf();
  }

  lt(that) {
    throwForWrongTypeAllowingNull(that);
    return !that || this.valueOf() < that.valueOf();
  }

  gte(that) {
    throwForWrongTypeAllowingNull(that);
    return !that || this.valueOf() >= that.valueOf();
  }

  lte(that) {
    throwForWrongTypeAllowingNull(that);
    return !that || this.valueOf() <= that.valueOf();
  }


  isWithin(start, end) {
    return this.gte(start) && this.lte(end);
  }

  prevMonthOf(month) {
    const ym = this.factory.fromNumbers(this.year(), month);
    return ym <= this ? ym : ym.addMonths(-12);
  }

  nextMonthOf(month) {
    const ym = this.factory.fromNumbers(this.year(), month);
    return ym >= this ? ym : ym.addMonths(12);
  }
}
class YearMonthFactory {
  constructor(parser, formatter) {
    this.parser = parser;
    this.formatter = formatter;
  }

  withParser(fn) {
    return new YearMonthFactory(fn, this.formatter);
  }

  withFormatter(fn) {
    return new YearMonthFactory(this.parser, fn);
  }

  fromNumbers(year, month) {
    const yearNum = Number(year);
    const monthNum = Number(month);
    if (! Number.isInteger(yearNum)) {
      throw new Error(`Invalid year "${year}"`);
    }
    if (! Number.isInteger(monthNum)) {
      throw new Error(`Invalid month "${month}"`);
    }
    return new YearMonth(
      ((yearNum - YEAR_ZERO) * 12) + (monthNum - 1),
      this
    );
  }

  parse(formatted) {
    const [year, month] = this.parser(formatted);
    return this.fromNumbers(year, month);
  }

  safeParse(stringOrYearMonth) {
    if (stringOrYearMonth instanceof YearMonth) {
      return stringOrYearMonth;
    }
    return this.parse(stringOrYearMonth);
  }
}

module.exports = new YearMonthFactory(DEFAULT_PARSER, DEFAULT_FORMATTER);
