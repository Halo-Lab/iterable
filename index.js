export function isList(value) {
  return typeof value === 'function' && Symbol.iterator in value
}

export function map(source, callback) {
  return callback
    ? from(function* () {
        for (const value of source) yield callback(value)
      })
    : (anotherSource) => map(anotherSource, source)
}

export function chain(source, callback) {
  return callback
    ? from(function* () {
        for (const value of source) yield* callback(value)
      })
    : (anotherSource) => chain(anotherSource, source)
}

export function filter(source, predicate) {
  return predicate
    ? from(function* () {
        for (const value of source) if (predicate(value)) yield value
      })
    : (anotherSource) => filter(anotherSource, source)
}

export function forEach(source, callback) {
  if (callback) for (const value of source) callback(value)
  else return (anotherSource) => forEach(anotherSource, source)
}

export function of(...values) {
  return from(values)
}

export function from(value) {
  if (typeof value === 'function') {
    value[Symbol.iterator] = value

    return value
  }

  if (!(Symbol.iterator in value)) value = Array.from(value)

  return from(function* () {
    yield* value
  })
}

export function fold(source, accumulator, reduce = accumulator) {
  if (isList(source)) {
    let intermediate = accumulator
    const iterableIterator = source()

    if (reduce === intermediate) intermediate = iterableIterator.next().value

    for (const value of iterableIterator)
      intermediate = reduce(intermediate, value)

    return intermediate
  } else return (anotherSource) => fold(anotherSource, source, accumulator)
}

export function concat(source, other) {
  return other
    ? from(function* () {
        yield* source
        yield* other
      })
    : (anotherSource) => concat(anotherSource, source)
}

export function all(source, predicate) {
  if (predicate) {
    for (const item of source) if (!predicate(item)) return false

    return true
  } else return (anotherSource) => all(anotherSource, source)
}

export function any(source, predicate) {
  if (predicate) {
    for (const item of source) if (predicate(item)) return true

    return false
  } else return (anotherSource) => any(anotherSource, source)
}

export function take(source, amount) {
  if (isList(source)) {
    let _amount = amount

    return takeWhile(source, () => _amount-- > 0 || ((_amount = amount), false))
  } else return (anotherSource) => take(anotherSource, source)
}

export function takeWhile(source, predicate) {
  return predicate
    ? from(function* () {
        for (const value of source) {
          if (predicate(value)) yield value
          else return
        }
      })
    : (anotherSource) => takeWhile(anotherSource, source)
}

export function skip(source, amount) {
  return isList(source)
    ? from(function* () {
        let _amount = amount

        for (const value of source) _amount <= 0 ? yield value : _amount--
      })
    : (anotherSource) => skip(anotherSource, source)
}

export function skipWhile(source, predicate) {
  return predicate
    ? from(function* () {
        let skipping = true

        for (const value of source)
          skipping
            ? !(skipping = predicate(value)) && (yield value)
            : yield value
      })
    : (anotherSource) => skipWhile(anotherSource, source)
}

export function enumerate(source) {
  return from(function* () {
    let index = 0

    for (const value of source) yield [value, index++]
  })
}

export function sort(source, compare) {
  return compare
    ? from(function* () {
        yield* Array.from(source).sort(compare)
      })
    : (anotherSource) => sort(anotherSource, source)
}

export function count(source) {
  return fold(source, 0, (amount) => amount + 1)
}

export function scan(source, accumulator, reduce = accumulator) {
  return isList(source)
    ? from(function* () {
        let intermediate = accumulator
        const iterableIterator = source()

        if (intermediate === reduce)
          yield (intermediate = iterableIterator.next().value)

        for (const value of iterableIterator)
          yield (intermediate = reduce(intermediate, value))
      })
    : (anotherSource) => scan(anotherSource, source, accumulator)
}

export function first(source) {
  return source().next().value
}

export function isEmpty(source) {
  return Boolean(source().next().done)
}

export function last(source) {
  return fold(source, (_, value) => value)
}

export function zip(source, other) {
  return other
    ? from(function* () {
        const otherIterator = other()

        for (const item of source) {
          const { done, value } = otherIterator.next()

          if (done) return

          yield [item, value]
        }
      })
    : (anotherSource) => zip(anotherSource, source)
}

export function find(source, predicate) {
  if (predicate) {
    for (const item of source) if (predicate(item)) return item
  } else return (anotherSource) => find(anotherSource, source)
}

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
  forEach,
  takeWhile,
  skipWhile,
  enumerate,
}
