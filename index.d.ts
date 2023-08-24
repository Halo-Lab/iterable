export function isIterable<A>(value: Iterable<A>): true;
export function isIterable<A>(value: unknown): value is Iterable<A>;

export function map<A, B>(
  callback: (value: A) => B,
): (source: Iterable<A>) => Iterable<B>;
export function map<A, B>(
  source: Iterable<A>,
  callback: (value: A) => B,
): Iterable<B>;

export function chain<A, B>(
  callback: (value: A) => Iterable<B>,
): (source: Iterable<A>) => Iterable<B>;
export function chain<A, B>(
  source: Iterable<A>,
  callback: (value: A) => Iterable<B>,
): Iterable<B>;

export function filter(
  predicate: BooleanConstructor,
): <A>(
  source: Iterable<A>,
) => Iterable<Exclude<A, null | undefined | 0 | "" | false>>; // except NaN because it has the "number" type
export function filter<A, B extends A>(
  predicate: (value: A) => value is B,
): (source: Iterable<A>) => Iterable<B>;
export function filter<A>(
  predicate: (value: A) => boolean,
): (source: Iterable<A>) => Iterable<A>;
export function filter<A>(
  source: Iterable<A>,
  predicate: BooleanConstructor,
): Iterable<Exclude<A, null | undefined | 0 | "" | false>>; // except NaN because it has the "number" type
export function filter<A, B extends A>(
  source: Iterable<A>,
  predicate: (value: A) => value is B,
): Iterable<B>;
export function filter<A>(
  source: Iterable<A>,
  predicate: (value: A) => boolean,
): Iterable<A>;

export function forEach<A>(
  callback: (value: A) => void,
): (source: Iterable<A>) => void;
export function forEach<A>(
  source: Iterable<A>,
  callback: (value: A) => void,
): void;

export function of<T>(...values: readonly T[]): Iterable<T>;

export function from<const A>(
  value: (() => Iterator<A, void, unknown>) | Iterable<A> | ArrayLike<A>,
): Iterable<A>;

export function fold<A, B = A>(
  accumulator: B,
  reducer: (accumulator: B, value: A) => B,
): (source: Iterable<A>) => B;
export function fold<A, B = A>(
  source: Iterable<A>,
  accumulator: B,
  reducer: (accumulator: B, value: A) => B,
): B;

export function concat<A>(
  list: Iterable<A>,
): (source: Iterable<A>) => Iterable<A>;
export function concat<A>(source: Iterable<A>, other: Iterable<A>): Iterable<A>;

export function all<A>(
  predicate: (value: A) => boolean,
): (source: Iterable<A>) => boolean;
export function all<A>(
  source: Iterable<A>,
  predicate: (value: A) => boolean,
): boolean;

export function any<A>(
  predicate: (value: A) => boolean,
): (source: Iterable<A>) => boolean;
export function any<A>(
  source: Iterable<A>,
  predicate: (value: A) => boolean,
): boolean;

export function take(amount: number): <A>(source: Iterable<A>) => Iterable<A>;
export function take<A>(source: Iterable<A>, amount: number): Iterable<A>;

export function skip(amount: number): <A>(source: Iterable<A>) => Iterable<A>;
export function skip<A>(source: Iterable<A>, amount: number): Iterable<A>;

export function takeWhile<A>(
  predicate: (value: A) => boolean,
): (source: Iterable<A>) => Iterable<A>;
export function takeWhile<A>(
  source: Iterable<A>,
  predicate: (value: A) => boolean,
): Iterable<A>;

export function skipWhile<A>(
  predicate: (value: A) => boolean,
): (source: Iterable<A>) => Iterable<A>;
export function skipWhile<A>(
  source: Iterable<A>,
  predicate: (value: A) => boolean,
): Iterable<A>;

export function enumerate<A>(
  source: Iterable<A>,
): Iterable<readonly [value: A, index: number]>;

export function sort<A>(
  compare: (first: A, second: A) => number,
): (source: Iterable<A>) => Iterable<A>;
export function sort<A>(
  source: Iterable<A>,
  compare: (first: A, second: A) => number,
): Iterable<A>;

export function count<A>(source: Iterable<A>): number;

export function scan<A, B = A>(
  accumulator: B,
  reducer: (accumulator: B, value: A) => B,
): (source: Iterable<A>) => Iterable<B>;
export function scan<A, B = A>(
  source: Iterable<A>,
  accumulator: B,
  reducer: (accumulator: B, value: A) => B,
): Iterable<B>;

export function first<A>(source: Iterable<A>): A | undefined;

export function isEmpty<A>(source: Iterable<A>): boolean;

export function last<A>(source: Iterable<A>): A | undefined;

export function zip<B>(
  other: Iterable<B>,
): <A>(source: Iterable<A>) => Iterable<readonly [A, B]>;
export function zip<A, B>(
  source: Iterable<A>,
  other: Iterable<B>,
): Iterable<readonly [A, B]>;

export function find<A, B extends A>(
  predicate: (value: A) => value is B,
): (source: Iterable<A>) => B | undefined;
export function find<A>(
  predicate: (value: A) => boolean,
): (source: Iterable<A>) => A | undefined;
export function find<A, B extends A>(
  source: Iterable<A>,
  predicate: (value: A) => value is B,
): B | undefined;
export function find<A>(
  source: Iterable<A>,
  predicate: (value: A) => boolean,
): A | undefined;

export function group<A, B>(
  callback: (value: A) => B,
): (source: Iterable<A>) => Iterable<readonly [B, Iterable<A>]>;
export function group<A, B>(
  source: Iterable<A>,
  callback: (value: A) => B,
): Iterable<readonly [B, Iterable<A>]>;

export function unzip<A, B>(
  source: Iterable<readonly [A, B]>,
): readonly [Iterable<A>, Iterable<B>];

export function unique(): <A>(source: Iterable<A>) => Iterable<A>;
export function unique<A>(
  callback: (item: A) => unknown,
): (source: Iterable<A>) => Iterable<A>;
export function unique<A>(source: Iterable<A>): Iterable<A>;
export function unique<A>(
  source: Iterable<A>,
  callback: (item: A) => unknown,
): Iterable<A>;

type _of = typeof of;
type _is = typeof isIterable;
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

declare namespace Iterable {
  export type Self<A> = Iterable<A>;

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

export default Iterable;
