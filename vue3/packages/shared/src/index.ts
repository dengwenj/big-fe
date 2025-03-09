export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export function isFunction(obj) {
  return typeof obj === 'function'
}

export * from './shapeFlags'