
export function collectionToArray (collection) {
  const result = []

  for (var i = 0; i < collection.length; i++) {
    result.push(collection.item(i))
  }

  return result
}

export function each (obj, fn) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      fn(obj[key], key, obj)
    }
  }
}

export function map (obj, cb, ctx) {
  const result = {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = cb.call(ctx, obj[key], key, obj)
    }
  }

  return result
}

export default {
  collectionToArray,
  each
}
