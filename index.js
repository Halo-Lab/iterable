const GeneratorFunction = (function*() { }).constructor

function isGeneratorFunction(value) {
  return value instanceof GeneratorFunction
}

function operator(finish, minimalArity = finish.length - 1) {
  return (source, ...params) => params.length >= minimalArity
    ? finish(source, ...params)
    : (anotherSource) => finish(anotherSource, source, ...params)
}

export const map = operator(
  (source, callback) =>
    function*() {
      for (const value of source())
        yield callback(value)
    }
)

export const chain = operator(
  (source, callback) =>
    function*() {
      for (const value of source())
        yield* callback(value)
    }
)

export const filter = operator(
  (source, predicate) =>
    function*() {
      for (const value of source())
        if (predicate(value)) yield value
    }
)

export const forEach = operator(
  (source, callback) => {
    for (const value of source())
      callback(value)
  }
)

export function of(...values) {
  return from(values)
}

export function from(value) {
  if (isGeneratorFunction(value)) return value

  if (!(Symbol.iterator in value)) value = Array.from(value)

  return function*() {
    yield* value
  }
}

export const fold = operator(
  (source, accumulator, reduce) => {
    let intermediate = accumulator
    const iterableIterator = source()

    if (reduce === undefined)
      (reduce = intermediate, intermediate = iterableIterator.next().value)

    for (const value of iterableIterator)
      intermediate = reduce(intermediate, value)

    return intermediate
  },
  1
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
    for (const item of source())
      if (!predicate(item)) return false

    return true
  }
)

export const any = operator(
  (source, predicate) => {
    for (const item of source())
      if (predicate(item)) return true

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

    for (const value of source())
      yield [value, index++]
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
  (source, accumulator, reduce) => {
    if (reduce === undefined)
      (reduce = accumulator, accumulator = undefined)

    return function*() {
      let intermediate = accumulator
      const iterableIterator = source()

      if (intermediate === undefined)
        yield intermediate = iterableIterator.next().value

      for (const value of iterableIterator)
        yield intermediate = reduce(intermediate, value)
    }
  },
  1
)

export const collect = operator(
  (source, fromGenerator) => fromGenerator(source())
)

export function first(source) {
  return source().next().value
}

export function isEmpty(source) {
  return Boolean(source().next().done)
}

export function last(source) {
  return fold(source, (_, value) => value)
}

export const zip = operator(
  (source, other) =>
    function*() {
      const otherIterator = other()

      for (const item of source()) {
        const { done, value } = otherIterator.next()

        if (done) return

        yield [item, value]
      }
    }
)

export default {
  of,
  all,
  zip,
  any,
  map,
  skip,
  last,
  from,
  fold,
  take,
  sort,
  scan,
  count,
  first,
  chain,
  filter,
  concat,
  isEmpty,
  collect,
  forEach,
  takeWhile,
  skipWhile,
  enumerate,
}