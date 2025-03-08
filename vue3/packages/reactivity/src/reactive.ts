import { isObject } from "@vue/shared"
import { mutableHandler } from "./baseHandler"
import { ReactiveFlags } from "./constants"

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

export function isReactive(value) {
  // 是 proxy 的就会去访问 get，get函数里面处理了如果是这个属性 ReactiveFlags.IS_REACTIVE 就返回 true
  // 不是 proxy 直接就不会去访问 get 函数
  return (value && value[ReactiveFlags.IS_REACTIVE])
}
