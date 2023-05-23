const LIST = '@@list'

function operator(finish) {
  return (source, ...params) => isList(source)
    ? finish(source, ...params)
    : (anotherSource) => finish(anotherSource, source, ...params)
}

export function isList(value) {
  return typeof value === 'function' && value === value[LIST]
}

export const map = operator(
  (source, callback) =>
    from(function*() {
      for (const value of source())
        yield callback(value)
    })
)

export const chain = operator(
  (source, callback) =>
    from(function*() {
      for (const value of source())
        yield* callback(value)
    })
)

export const filter = operator(
  (source, predicate) =>
    from(function*() {
      for (const value of source())
        if (predicate(value)) yield value
    })
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
  if (typeof value === 'function') {
    value[LIST] = value

    return value
  }

  if (!(Symbol.iterator in value)) value = Array.from(value)

  return from(function*() {
    yield* value
  })
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
  }
)

export const concat = operator(
  (source, list) =>
    from(function*() {
      yield* source()
      yield* list()
    })
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
    from(function*() {
      for (const value of source()) {
        if (predicate(value)) yield value
        else return
      }
    })
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
  return from(function*() {
    let index = 0

    for (const value of source())
      yield [value, index++]
  })
}

export const sort = operator(
  (source, compare) =>
    from(function*() {
      yield* Array.from(source()).sort(compare)
    })
)

export function count(source) {
  return fold(source, 0, (amount) => amount + 1)
}

export const scan = operator(
  (source, accumulator, reduce) => {
    if (reduce === undefined)
      (reduce = accumulator, accumulator = undefined)

    return from(function*() {
      let intermediate = accumulator
      const iterableIterator = source()

      if (intermediate === undefined)
        yield intermediate = iterableIterator.next().value

      for (const value of iterableIterator)
        yield intermediate = reduce(intermediate, value)
    })
  }
)

export const collect = operator(
  (source, fromIterator) => fromIterator(source())
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
    from(function*() {
      const otherIterator = other()

      for (const item of source()) {
        const { done, value } = otherIterator.next()

        if (done) return

        yield [item, value]
      }
    })
)

export const find = operator(
  (source, predicate) => {
    for (const item of source())
      if (predicate(item)) return item
  }
)

export default {
  of,
  is: isList,
  all,
  zip,
  any,
  map,
  skip,
  last,
  from,
  fold,
  find,
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