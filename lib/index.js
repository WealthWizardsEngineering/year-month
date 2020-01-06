const YEAR_ZERO = 1970;

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

class YearMonth {
  constructor(monthNum) {
    this.monthNum = monthNum;
    Object.freeze(this);
  }

  static fromNumbers(year, month) {
    return new YearMonth(((Number(year) - YEAR_ZERO) * 12) + (Number(month) - 1));
  }

  static parse(formatted) {
    const [year, month] = formatted.split('-');
    return YearMonth.fromNumbers(year, month);
  }

  static safeParse(stringOrYearMonth) {
    if (stringOrYearMonth instanceof YearMonth) {
      return stringOrYearMonth;
    }
    return YearMonth.parse(stringOrYearMonth);
  }

  year() {
    return Math.floor(this.monthNum / 12) + YEAR_ZERO;
  }

  month() {
    return (this.monthNum % 12) + 1;
  }

  toString() {
    const yearString = `${this.year()}`.padStart(4, '0');
    const monthString = `${this.month()}`.padStart(2, '0');
    return `${yearString}-${monthString}`;
  }

  toJSON() {
    return this.toString();
  }

  addMonths(months) {
    return new YearMonth(this.monthNum + months);
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
    return (!start || start.valueOf() <= this.valueOf())
      && ((!end) || end.valueOf() >= this.valueOf());
  }

  prevMonthOf(month) {
    const ym = YearMonth.fromNumbers(this.year(), month);
    return ym <= this ? ym : ym.addMonths(-12);
  }

  nextMonthOf(month) {
    const ym = YearMonth.fromNumbers(this.year(), month);
    return ym >= this ? ym : ym.addMonths(12);
  }
}

module.exports = {
  YearMonth,
};
