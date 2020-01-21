export interface YearMonth {
    year: () => number,
    month: () => number,
    toString: () => string,
    toJSON: () => string,
    addMonths: (months: number) => YearMonth,
    addYears: (months: number) => YearMonth,
    valueOf: () => number,
    equals: (that: any) => boolean,
    diff: (that: YearMonth) => number,
    gt: (that: YearMonth) => boolean,
    lt: (that: YearMonth) => boolean,
    gte: (that: YearMonth) => boolean,
    lte: (that: YearMonth) => boolean,
    isWithin: (start: YearMonth, end: YearMonth) => boolean,
    prevMonthOf: (month: number) => YearMonth,
    nextMonthOf: (month: number) => YearMonth,
}

export interface YearMonthFactory {
    withParser: (parser: (s: string) => number[]) => YearMonthFactory,
    withFormatter: (formatter: (year: number, month: number) => string) => YearMonthFactory,
    isYearMonth: (o: object) => boolean,
    fromNumbers: (year: number, month: number) => YearMonth,
    parse: (s: string) => YearMonth,
    safeParse: (s: string | YearMonth ) => YearMonth,
}

export function withParser(parser: (s: string) => number[]): YearMonthFactory;
export function withFormatter(fn: (year: number, month: number) => string): YearMonthFactory;
export function isYearMonth(o: object): boolean;
export function fromNumbers(year: number, month: number): YearMonth;
export function parse(s: string): YearMonth;
export function safeParse(s: string | YearMonth ): YearMonth;