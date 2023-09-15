export function isAsyncIterable<A>(value: AsyncIterable<A>): true;
export function isAsyncIterable<A>(value: unknown): value is AsyncIterable<A>;

export function map<A, B>(
  callback: (value: A) => B | Promise<B>,
): (source: AsyncIterable<A>) => AsyncIterable<B>;
export function map<A, B>(
  source: AsyncIterable<A>,
  callback: (value: A) => B | Promise<B>,
): AsyncIterable<B>;

export function chain<A, B>(
  callback: (value: A) => AsyncIterable<B>,
): (source: AsyncIterable<A>) => AsyncIterable<B>;
export function chain<A, B>(
  source: AsyncIterable<A>,
  callback: (value: A) => AsyncIterable<B>,
): AsyncIterable<B>;

export function filter(
  predicate: BooleanConstructor,
): <A>(
  source: AsyncIterable<A>,
) => AsyncIterable<Exclude<A, null | undefined | 0 | "" | false>>; // except NaN because it has the "number" type
export function filter<A, B extends A>(
  predicate: (value: A) => value is B,
): (source: AsyncIterable<A>) => AsyncIterable<B>;
export function filter<A>(
  predicate: (value: A) => boolean,
): (source: AsyncIterable<A>) => AsyncIterable<A>;
export function filter<A>(
  source: AsyncIterable<A>,
  predicate: BooleanConstructor,
): AsyncIterable<Exclude<A, null | undefined | 0 | "" | false>>; // except NaN because it has the "number" type
export function filter<A, B extends A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => value is B,
): AsyncIterable<B>;
export function filter<A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => boolean,
): AsyncIterable<A>;

export function forEach<A>(
  callback: (value: A) => void,
): (source: AsyncIterable<A>) => Promise<void>;
export function forEach<A>(
  source: AsyncIterable<A>,
  callback: (value: A) => void,
): Promise<void>;

export function of<T>(...values: readonly T[]): AsyncIterable<T>;

export function from<const A>(
  value:
    | (() => AsyncIterator<A, void, unknown>)
    | AsyncIterable<A>
    | ArrayLike<A>,
): AsyncIterable<A>;

export function fold<A, B = A>(
  accumulator: B,
  reducer: (accumulator: B, value: A) => B | Promise<B>,
): (source: AsyncIterable<A>) => Promise<B>;
export function fold<A, B = A>(
  source: AsyncIterable<A>,
  accumulator: B,
  reducer: (accumulator: B, value: A) => B | Promise<B>,
): Promise<B>;

export function concat<A>(
  list: AsyncIterable<A>,
): (source: AsyncIterable<A>) => AsyncIterable<A>;
export function concat<A>(
  source: AsyncIterable<A>,
  other: AsyncIterable<A>,
): AsyncIterable<A>;

export function all<A>(
  predicate: (value: A) => boolean,
): (source: AsyncIterable<A>) => Promise<boolean>;
export function all<A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => boolean,
): Promise<boolean>;

export function any<A>(
  predicate: (value: A) => boolean,
): (source: AsyncIterable<A>) => Promise<boolean>;
export function any<A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => boolean,
): Promise<boolean>;

export function take(
  amount: number,
): <A>(source: AsyncIterable<A>) => AsyncIterable<A>;
export function take<A>(
  source: AsyncIterable<A>,
  amount: number,
): AsyncIterable<A>;

export function skip(
  amount: number,
): <A>(source: AsyncIterable<A>) => AsyncIterable<A>;
export function skip<A>(
  source: AsyncIterable<A>,
  amount: number,
): AsyncIterable<A>;

export function takeWhile<A>(
  predicate: (value: A) => boolean,
): (source: AsyncIterable<A>) => AsyncIterable<A>;
export function takeWhile<A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => boolean,
): AsyncIterable<A>;

export function skipWhile<A>(
  predicate: (value: A) => boolean,
): (source: AsyncIterable<A>) => AsyncIterable<A>;
export function skipWhile<A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => boolean,
): AsyncIterable<A>;

export function enumerate<A>(
  source: AsyncIterable<A>,
): AsyncIterable<readonly [value: A, index: number]>;

export function sort<A>(
  compare: (first: A, second: A) => number,
): (source: AsyncIterable<A>) => AsyncIterable<A>;
export function sort<A>(
  source: AsyncIterable<A>,
  compare: (first: A, second: A) => number,
): AsyncIterable<A>;

export function count<A>(source: AsyncIterable<A>): Promise<number>;

export function scan<A, B = A>(
  accumulator: B,
  reducer: (accumulator: B, value: A) => B | Promise<B>,
): (source: AsyncIterable<A>) => AsyncIterable<B>;
export function scan<A, B = A>(
  source: AsyncIterable<A>,
  accumulator: B,
  reducer: (accumulator: B, value: A) => B | Promise<B>,
): AsyncIterable<B>;

export function first<A>(source: AsyncIterable<A>): Promise<A | undefined>;

export function isEmpty<A>(source: AsyncIterable<A>): Promise<boolean>;

export function last<A>(source: AsyncIterable<A>): Promise<A | undefined>;

export function zip<B>(
  other: AsyncIterable<B>,
): <A>(source: AsyncIterable<A>) => AsyncIterable<readonly [A, B]>;
export function zip<A, B>(
  source: AsyncIterable<A>,
  other: AsyncIterable<B>,
): AsyncIterable<readonly [A, B]>;

export function find<A, B extends A>(
  predicate: (value: A) => value is B,
): (source: AsyncIterable<A>) => Promise<B | undefined>;
export function find<A>(
  predicate: (value: A) => boolean,
): (source: AsyncIterable<A>) => Promise<A | undefined>;
export function find<A, B extends A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => value is B,
): Promise<B | undefined>;
export function find<A>(
  source: AsyncIterable<A>,
  predicate: (value: A) => boolean,
): Promise<A | undefined>;

export function group<A, B>(
  callback: (value: A) => B,
): (source: AsyncIterable<A>) => AsyncIterable<readonly [B, AsyncIterable<A>]>;
export function group<A, B>(
  source: AsyncIterable<A>,
  callback: (value: A) => B,
): AsyncIterable<readonly [B, AsyncIterable<A>]>;

export function unzip<A, B>(
  source: AsyncIterable<readonly [A, B]>,
): readonly [AsyncIterable<A>, AsyncIterable<B>];

export function unique(): <A>(source: AsyncIterable<A>) => AsyncIterable<A>;
export function unique<A>(
  callback: (item: A) => unknown,
): (source: AsyncIterable<A>) => AsyncIterable<A>;
export function unique<A>(source: AsyncIterable<A>): AsyncIterable<A>;
export function unique<A>(
  source: AsyncIterable<A>,
  callback: (item: A) => unknown,
): AsyncIterable<A>;

type _of = typeof of;
type _is = typeof isAsyncIterable;
type _all = typeof all;
type _any = typeof any;
type _zip = typeof zip;
type _map = typeof map;
type _take = typeof take;
type _skip = typeof skip;
type _last = typeof last;
type _from = typeof from;
type _scan = typeof scan;
type _sort = typeof sort;
type _fold = typeof fold;
type _find = typeof find;
type _unzip = typeof unzip;
type _group = typeof group;
type _chain = typeof chain;
type _count = typeof count;
type _first = typeof first;
type _filter = typeof filter;
type _concat = typeof concat;
type _unique = typeof unique;
type _isEmpty = typeof isEmpty;
type _forEach = typeof forEach;
type _takeWhile = typeof takeWhile;
type _skipWhile = typeof skipWhile;
type _enumerate = typeof enumerate;

declare namespace AsyncIterable {
  export type Self<A> = AsyncIterable<A>;

  export const of: _of;
  export const is: _is;
  export const all: _all;
  export const any: _any;
  export const zip: _zip;
  export const map: _map;
  export const take: _take;
  export const sort: _sort;
  export const skip: _skip;
  export const last: _last;
  export const from: _from;
  export const scan: _scan;
  export const fold: _fold;
  export const find: _find;
  export const unzip: _unzip;
  export const group: _group;
  export const chain: _chain;
  export const count: _count;
  export const first: _first;
  export const filter: _filter;
  export const concat: _concat;
  export const unique: _unique;
  export const isEmpty: _isEmpty;
  export const forEach: _forEach;
  export const takeWhile: _takeWhile;
  export const skipWhile: _skipWhile;
  export const enumerate: _enumerate;
}

export default AsyncIterable;
