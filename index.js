const GeneratorFunction = (function*() { }).constructor

export function isGeneratorFunction(value) {
  return value instanceof GeneratorFunction
}

function operator(finish) {
  return (source, ...params) => isGeneratorFunction(source)
    ? finish(source, ...params)
    : (anotherSource) => finish(anotherSource, source, ...params)
}

export const map = operator(
  (source, callback) =>
    function*() {
      for (const value of source()) {
        yield callback(value)
      }
    }
)

export const chain = operator(
  (source, callback) =>
    function*() {
      for (const value of source()) {
        yield* callback(value)
      }
    }
)

export const filter = operator(
  (source, predicate) =>
    function*() {
      for (const value of source()) {
        if (predicate(value)) yield value
      }
    }
)

export const forEach = operator(
  (source, callback) => {
    for (const value of source()) {
      callback(value)
    }
  }
)

export function of(...values) {
  return from(values)
}

function from(value) {
  return function*() {
    if ('length' in value)
      typeof value === 'function'
        ? yield* from(value())
        : yield* Array.from(value)
    else yield* (Symbol.iterator in value ? value : { [Symbol.iterator]: () => value })
  }
}

export const fold = operator(
  (source, accumulator, reducer) => {
    const iterableIterator = source()

    if (typeof accumulator === 'function' && reducer === undefined)
      (reducer = accumulator, accumulator = iterableIterator.next().value)

    for (const value of iterableIterator) {
      accumulator = reducer(accumulator, value)
    }

    return accumulator
  }
)

export const concat = operator(
  (source, list) =>
    function*() {
      yield* source()
      yield* list()
    }
)

export const all = operator(
  (source, predicate) => {
    for (const item of source()) {
      if (!predicate(item)) return false
    }

    return true
  }
)

export const any = operator(
  (source, predicate) => {
    for (const item of source()) {
      if (predicate(item)) return true
    }

    return false
  }
)

export const take = operator(
  (source, amount) => takeWhile(source, () => amount-- > 0)
)

export const takeWhile = operator(
  (source, predicate) =>
    function*() {
      for (const value of source()) {
        if (predicate(value)) yield value
        else return
      }
    }
)

export const skip = operator(
  (source, amount) =>
    filter(source, () => amount <= 0 ? true : (amount--, false))
)

export const skipWhile = operator(
  (source, predicate) => {
    let skipping = true

    return filter(source, (value) => skipping ? !(skipping = predicate(value)) : true)
  }
)

export function enumerate(source) {
  return function*() {
    let index = 0

    for (const value of source()) {
      yield [value, index++]
    }
  }
}

export const sort = operator(
  (source, compare) =>
    function*() {
      yield* Array.from(source()).sort(compare)
    }
)

export function count(source) {
  return fold(source, 0, (amount) => amount + 1)
}

export const scan = operator(
  (source, accumulator, reducer) =>
    function*() {
      const iterableIterator = source()

      if (typeof accumulator === 'function' && reducer === undefined)
        (reducer = accumulator, accumulator = iterableIterator.next().value)

      for (const value of iterableIterator) {
        yield accumulator = reducer(accumulator, value)
      }
    }
)

export default {
  of,
  is: isGeneratorFunction,
  all,
  any,
  map,
  skip,
  from,
  fold,
  take,
  sort,
  scan,
  count,
  chain,
  filter,
  concat,
  forEach,
  takeWhile,
  skipWhile,
  enumerate,
}