export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

export function isFunction(obj) {
  return typeof obj === 'function'
}

export function isString(val) {
  return typeof val === 'string'
}

export * from './shapeFlags'

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (value, key) => hasOwnProperty.call(value, key)
