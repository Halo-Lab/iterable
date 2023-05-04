export interface List<A> {
  (): Generator<A, void, unknown>
}

export function isGeneratorFunction<T>(value: List<T>): true
export function isGeneratorFunction<const D extends readonly unknown[], A, B, C>(value: (...params: D) => Generator<A, B, C>): true
export function isGeneratorFunction<const D extends readonly unknown[], A, B, C>(value: unknown): value is (...params: D) => Generator<A, B, C>

export function map<A, B>(callback: (value: A) => B): (source: List<A>) => List<B>
export function map<A, B>(source: List<A>, callback: (value: A) => B): List<B>

export function chain<A, B>(callback: (value: A) => List<B>): (source: List<A>) => List<B>
export function chain<A, B>(source: List<A>, callback: (value: A) => List<B>): List<B>

export function filter(predicate: BooleanConstructor): <A>(source: List<A>) => List<Exclude<A, null | undefined | 0 | '' | false>> // except NaN because it has the "number" type
export function filter<A, B extends A>(predicate: (value: A) => value is B): (source: List<A>) => List<B>
export function filter<A>(predicate: (value: A) => boolean): (source: List<A>) => List<A>
export function filter<A>(source: List<A>, predicate: BooleanConstructor): List<Exclude<A, null | undefined | 0 | '' | false>> // except NaN because it has the "number" type
export function filter<A, B extends A>(source: List<A>, predicate: (value: A) => value is B): List<B>
export function filter<A>(source: List<A>, predicate: (value: A) => boolean): List<A>

export function forEach<A>(callback: (value: A) => void): (source: List<A>) => void
export function forEach<A>(source: List<A>, callback: (value: A) => void): void

export function of<const T extends readonly unknown[]>(...values: T): List<T[number]>

export function from<const A>(value: List<A> | Iterable<A> | ArrayLike<A>): List<A>

export function fold<A>(reducer: (accumulator: A, value: A) => A): (source: List<A>) => A
export function fold<A, const B>(accumulator: B, reducer: (accumulator: B, value: A) => B): (source: List<A>) => B
export function fold<A>(source: List<A>, reducer: (accumulator: A, value: A) => A): A
export function fold<A, const B>(source: List<A>, accumulator: B, reducer: (accumulator: B, value: A) => B): B

export function concat<A>(list: List<A>): (source: List<A>) => List<A>
export function concat<A>(source: List<A>, list: List<A>): List<A>

export function all<A>(predicate: (value: A) => boolean): (source: List<A>) => boolean
export function all<A>(source: List<A>, predicate: (value: A) => boolean): boolean

export function any<A>(predicate: (value: A) => boolean): (source: List<A>) => boolean
export function any<A>(source: List<A>, predicate: (value: A) => boolean): boolean

export function take(amount: number): <A>(source: List<A>) => List<A>
export function take<A>(source: List<A>, amount: number): List<A>

export function skip(amount: number): <A>(source: List<A>) => List<A>
export function skip<A>(source: List<A>, amount: number): List<A>

export function takeWhile<A>(predicate: (value: A) => boolean): (source: List<A>) => List<A>
export function takeWhile<A>(source: List<A>, predicate: (value: A) => boolean): List<A>

export function skipWhile<A>(predicate: (value: A) => boolean): (source: List<A>) => List<A>
export function skipWhile<A>(source: List<A>, predicate: (value: A) => boolean): List<A>

export function enumerate<A>(source: List<A>): List<readonly [value: A, index: number]>

export function sort<A>(compare: (first: A, second: A) => number): (source: List<A>) => List<A>
export function sort<A>(source: List<A>, compare: (first: A, second: A) => number): List<A>

export function count<A>(source: List<A>): number

export function scan<A>(reducer: (accumulator: A, value: A) => A): (source: List<A>) => List<A>
export function scan<A, const B>(accumulator: B, reducer: (accumulator: B, value: A) => B): (source: List<A>) => List<B>
export function scan<A>(source: List<A>, reducer: (accumulator: A, value: A) => A): List<A>
export function scan<A, const B>(source: List<A>, accumulator: B, reducer: (accumulator: B, value: A) => B): List<B>

export function collect(fromGenerator: ArrayConstructor['from']): <A>(source: List<A>) => readonly A[]
export function collect<A, B>(fromGenerator: (generator: ReturnType<List<A>>) => B): (source: List<A>) => B
export function collect<A>(source: List<A>, fromGenerator: ArrayConstructor['from']): readonly A[]
export function collect<A, B>(source: List<A>, fromGenerator: (generator: ReturnType<List<A>>) => B): B

export function first<A>(source: List<A>): A | undefined

export function isEmpty<A>(source: List<A>): boolean

export function last<A>(source: List<A>): A | undefined

type _of = typeof of
type _is = typeof isGeneratorFunction
type _all = typeof all
type _any = typeof any
type _map = typeof map
type _take = typeof take
type _skip = typeof skip
type _last = typeof last
type _from = typeof from
type _scan = typeof scan
type _sort = typeof sort
type _fold = typeof fold
type _chain = typeof chain
type _count = typeof count
type _first = typeof first
type _filter = typeof filter
type _concat = typeof concat
type _isEmpty = typeof isEmpty
type _collect = typeof collect
type _forEach = typeof forEach
type _takeWhile = typeof takeWhile
type _skipWhile = typeof skipWhile
type _enumerate = typeof enumerate

declare namespace List {
  export type Self<A> = List<A>

  export const of: _of
  export const is: _is
  export const all: _all
  export const any: _any
  export const map: _map
  export const take: _take
  export const sort: _sort
  export const skip: _skip
  export const last: _last
  export const from: _from
  export const scan: _scan
  export const fold: _fold
  export const chain: _chain
  export const count: _count
  export const first: _first
  export const filter: _filter
  export const concat: _concat
  export const isEmpty: _isEmpty
  export const collect: _collect
  export const forEach: _forEach
  export const takeWhile: _takeWhile
  export const skipWhile: _skipWhile
  export const enumerate: _enumerate
}

export default List