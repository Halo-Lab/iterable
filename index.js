function operator(finish) {
  return (source, ...params) => isIterableIterator(source)
    ? finish(source, ...params)
    : (anotherSource) => finish(anotherSource, source, ...params)
}

export const map = operator(
  function*(source, callback) {
    for (const value of source) {
      yield callback(value)
    }
  }
)

export const chain = operator(
  function*(source, callback) {
    for (const value of source) {
      yield* callback(value)
    }
  }
)

export const filter = operator(
  function*(source, predicate) {
    for (const value of source) {
      if (predicate(value)) yield value
    }
  }
)

export const forEach = operator(
  (source, callback) => {
    for (const value of source) {
      callback(value)
    }
  }
)

export function* of(...values) {
  yield* values
}

export function* from(value) {
  if ('length' in value)
    typeof value === 'function'
      ? yield* from(value())
      : yield* Array.from(value)
  else yield* (Symbol.iterator in value ? value : { [Symbol.iterator]: () => value })
}

export function isIterableIterator(value) {
  return value && typeof value === 'object' && Symbol.iterator in value && typeof value.next === 'function'
}

export const fold = operator((source, accumulator, reducer) => {
  if (typeof accumulator === 'function' && reducer === undefined)
    (reducer = accumulator, accumulator = source.next().value)

  for (const value of source) {
    accumulator = reducer(accumulator, value)
  }

  return accumulator
})

export const concat = operator(
  function*(source, list) {
    yield* source
    yield* list
  }
)

export const all = operator(
  (source, predicate) => {
    for (const item of source) {
      if (!predicate(item)) return false
    }

    return true
  }
)

export const any = operator(
  (source, predicate) => {
    for (const item of source) {
      if (predicate(item)) return true
    }

    return false
  }
)

export const take = operator(
  (source, amount) => takeWhile(source, () => amount-- > 0)
)

export const takeWhile = operator(
  function*(source, predicate) {
    for (const value of source) {
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
  })

export function* enumerate(source) {
  let index = 0

  for (const value of source) {
    yield [value, index++]
  }
}

export default {
  of,
  is: isIterableIterator,
  all,
  any,
  map,
  take,
  skip,
  from,
  fold,
  take,
  chain,
  filter,
  concat,
  forEach,
  takeWhile,
  skipWhile,
  enumerate,
}