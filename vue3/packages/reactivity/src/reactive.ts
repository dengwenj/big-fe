import { isObject } from "@vue/shared"
import { mutableHandler, ReactiveFlags } from "./baseHandler"

const reactiveMap = new WeakMap()

export function reactive(target) {
  return createReactiveObject(target)
}

function createReactiveObject(target) {
  // 是否是对象
  if (!isObject(target)) {
    return target
  }

  // 如果传入的对象已经是 proxy，直接返回 proxy
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 如果对象已经缓存
  const exitsProxy = reactiveMap.get(target)
  if (exitsProxy) {
    return exitsProxy
  }

  const proxy = new Proxy(target, mutableHandler)
  reactiveMap.set(target, proxy)
  return proxy
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}
