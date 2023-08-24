export function isIterable(value) {
  return value != null && typeof value[Symbol.iterator] === "function";
}

export function map(source, callback) {
  return callback
    ? from(function* () {
        for (const value of source) yield callback(value);
      })
    : (anotherSource) => map(anotherSource, source);
}

export function chain(source, callback) {
  return callback
    ? from(function* () {
        for (const value of source) yield* callback(value);
      })
    : (anotherSource) => chain(anotherSource, source);
}

export function filter(source, predicate) {
  return predicate
    ? from(function* () {
        for (const value of source) if (predicate(value)) yield value;
      })
    : (anotherSource) => filter(anotherSource, source);
}

export function forEach(source, callback) {
  if (callback) for (const value of source) callback(value);
  else return (anotherSource) => forEach(anotherSource, source);
}

export function of(...values) {
  return from(values);
}

export function from(value) {
  if (isIterable(value)) return value;

  if (typeof value === "function") return (value[Symbol.iterator] = value);

  value = Array.from(value);

  return from(function* () {
    yield* value;
  });
}

export function fold(source, accumulator, reduce) {
  if (arguments.length === 3) {
    for (const value of source) accumulator = reduce(accumulator, value);

    return accumulator;
  } else return (anotherSource) => fold(anotherSource, source, accumulator);
}

export function concat(source, other) {
  return other
    ? from(function* () {
        yield* source;
        yield* other;
      })
    : (anotherSource) => concat(anotherSource, source);
}

export function all(source, predicate) {
  if (predicate) {
    for (const item of source) if (!predicate(item)) return false;

    return true;
  } else return (anotherSource) => all(anotherSource, source);
}

export function any(source, predicate) {
  if (predicate) {
    for (const item of source) if (predicate(item)) return true;

    return false;
  } else return (anotherSource) => any(anotherSource, source);
}

export function take(source, amount) {
  if (arguments.length === 2) {
    let _amount = amount;

    return takeWhile(
      source,
      () => _amount-- > 0 || ((_amount = amount), false),
    );
  } else return (anotherSource) => take(anotherSource, source);
}

export function takeWhile(source, predicate) {
  return predicate
    ? from(function* () {
        for (const value of source) {
          if (predicate(value)) yield value;
          else return;
        }
      })
    : (anotherSource) => takeWhile(anotherSource, source);
}

export function skip(source, amount) {
  return arguments.length === 2
    ? from(function* () {
        let _amount = amount;

        for (const value of source) _amount <= 0 ? yield value : _amount--;
      })
    : (anotherSource) => skip(anotherSource, source);
}

export function skipWhile(source, predicate) {
  return predicate
    ? from(function* () {
        let skipping = true;

        for (const value of source)
          skipping
            ? !(skipping = predicate(value)) && (yield value)
            : yield value;
      })
    : (anotherSource) => skipWhile(anotherSource, source);
}

export function enumerate(source) {
  return from(function* () {
    let index = 0;

    for (const value of source) yield [value, index++];
  });
}

export function sort(source, compare) {
  return compare
    ? from(function* () {
        yield* Array.from(source).sort(compare);
      })
    : (anotherSource) => sort(anotherSource, source);
}

export function count(source) {
  return fold(source, 0, (amount) => amount + 1);
}

export function scan(source, accumulator, reduce) {
  return arguments.length === 3
    ? from(function* () {
        let intermediate = accumulator;

        for (const value of source)
          yield (intermediate = reduce(intermediate, value));
      })
    : (anotherSource) => scan(anotherSource, source, accumulator);
}

export function first(source) {
  return source[Symbol.iterator]().next().value;
}

export function isEmpty(source) {
  return Boolean(source[Symbol.iterator]().next().done);
}

export function last(source) {
  return fold(source, (_, value) => value);
}

export function zip(source, other) {
  return other
    ? from(function* () {
        const otherIterator = other[Symbol.iterator]();

        for (const item of source) {
          const { done, value } = otherIterator.next();

          if (done) return;

          yield [item, value];
        }
      })
    : (anotherSource) => zip(anotherSource, source);
}

export function unzip(source) {
  return [
    from(function* () {
      for (const [first] of source) yield first;
    }),
    from(function* () {
      for (const [, second] of source) yield second;
    }),
  ];
}

export function find(source, predicate) {
  if (predicate) {
    for (const item of source) if (predicate(item)) return item;
  } else return (anotherSource) => find(anotherSource, source);
}

export function group(source, callback) {
  return callback
    ? from(function* () {
        const groups = new Map();

        forEach(source, (value) => {
          const key = callback(value);

          groups.set(key, concat(groups.get(key) ?? of(), of(value)));
        });

        for (const pair of groups) yield pair;
      })
    : (anotherSource) => group(anotherSource, source);
}

export function unique(source, callback = (item) => item) {
  return isIterable(source)
    ? from(function* () {
        const cache = new Set();

        for (const item of source) {
          const key = callback(item);

          cache.has(key) || (cache.add(key), yield item);
        }
      })
    : (anotherSource) => unique(anotherSource, source);
}

export default {
  of,
  is: isIterable,
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
  unzip,
  count,
  group,
  first,
  chain,
  filter,
  concat,
  unique,
  isEmpty,
  forEach,
  takeWhile,
  skipWhile,
  enumerate,
};
