export function isAsyncIterable(value) {
  return value != null && typeof value[Symbol.asyncIterator] === "function";
}

export function map(source, callback) {
  return callback
    ? from(async function* () {
        for await (const value of source) yield callback(value);
      })
    : (anotherSource) => map(anotherSource, source);
}

export function chain(source, callback) {
  return callback
    ? from(async function* () {
        for await (const value of source) yield* callback(value);
      })
    : (anotherSource) => chain(anotherSource, source);
}

export function filter(source, predicate) {
  return predicate
    ? from(async function* () {
        for await (const value of source) if (predicate(value)) yield value;
      })
    : (anotherSource) => filter(anotherSource, source);
}

export async function forEach(source, callback) {
  if (callback) for await (const value of source) callback(value);
  else return (anotherSource) => forEach(anotherSource, source);
}

export function of(...values) {
  return from(values);
}

export function from(value) {
  if (isAsyncIterable(value)) return value;

  if (typeof value === "function") return (value[Symbol.asyncIterator] = value);

  value = Array.from(value);

  return from(async function* () {
    yield* value;
  });
}

export async function fold(source, accumulator, reduce) {
  if (arguments.length === 3) {
    for await (const value of source)
      accumulator = await reduce(accumulator, value);

    return accumulator;
  } else return (anotherSource) => fold(anotherSource, source, accumulator);
}

export function concat(source, other) {
  return other
    ? from(async function* () {
        yield* source;
        yield* other;
      })
    : (anotherSource) => concat(anotherSource, source);
}

export async function all(source, predicate) {
  if (predicate) {
    for await (const item of source) if (!predicate(item)) return false;

    return true;
  } else return (anotherSource) => all(anotherSource, source);
}

export async function any(source, predicate) {
  if (predicate) {
    for await (const item of source) if (predicate(item)) return true;

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
    ? from(async function* () {
        for await (const value of source) {
          if (predicate(value)) yield value;
          else return;
        }
      })
    : (anotherSource) => takeWhile(anotherSource, source);
}

export function skip(source, amount) {
  return arguments.length === 2
    ? from(async function* () {
        let _amount = amount;

        for await (const value of source)
          _amount <= 0 ? yield value : _amount--;
      })
    : (anotherSource) => skip(anotherSource, source);
}

export function skipWhile(source, predicate) {
  return predicate
    ? from(async function* () {
        let skipping = true;

        for await (const value of source)
          skipping
            ? !(skipping = predicate(value)) && (yield value)
            : yield value;
      })
    : (anotherSource) => skipWhile(anotherSource, source);
}

export function enumerate(source) {
  return from(async function* () {
    let index = 0;

    for await (const value of source) yield [value, index++];
  });
}

export function sort(source, compare) {
  return compare
    ? from(async function* () {
        const items = [];

        for await (const item of source) items.push(item);

        yield* items.sort(compare);
      })
    : (anotherSource) => sort(anotherSource, source);
}

export function count(source) {
  return fold(source, 0, (amount) => amount + 1);
}

export function scan(source, accumulator, reduce) {
  return arguments.length === 3
    ? from(async function* () {
        let intermediate = accumulator;

        for await (const value of source)
          yield (intermediate = await reduce(intermediate, value));
      })
    : (anotherSource) => scan(anotherSource, source, accumulator);
}

export function first(source) {
  return source[Symbol.asyncIterator]()
    .next()
    .then(({ value }) => value);
}

export function isEmpty(source) {
  return source[Symbol.asyncIterator]()
    .next()
    .then(({ done }) => Boolean(done));
}

export function last(source) {
  return fold(source, (_, value) => value);
}

export function zip(source, other) {
  return other
    ? from(async function* () {
        const otherIterator = other[Symbol.asyncIterator]();

        for await (const item of source) {
          const { done, value } = await otherIterator.next();

          if (done) return;

          yield [item, value];
        }
      })
    : (anotherSource) => zip(anotherSource, source);
}

export function unzip(source) {
  return [
    from(async function* () {
      for await (const [first] of source) yield first;
    }),
    from(async function* () {
      for await (const [, second] of source) yield second;
    }),
  ];
}

export async function find(source, predicate) {
  if (predicate) {
    for await (const item of source) if (predicate(item)) return item;
  } else return (anotherSource) => find(anotherSource, source);
}

export function group(source, callback) {
  return callback
    ? from(async function* () {
        const groups = new Map();

        await forEach(source, (value) => {
          const key = callback(value);

          groups.set(key, concat(groups.get(key) ?? of(), of(value)));
        });

        for (const pair of groups) yield pair;
      })
    : (anotherSource) => group(anotherSource, source);
}

export function unique(source, callback = (item) => item) {
  return isAsyncIterable(source)
    ? from(async function* () {
        const cache = new Set();

        for await (const item of source) {
          const key = callback(item);

          cache.has(key) || (cache.add(key), yield item);
        }
      })
    : (anotherSource) => unique(anotherSource, source);
}

export default {
  of,
  is: isAsyncIterable,
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
