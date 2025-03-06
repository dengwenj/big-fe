import { isObject } from "@vue/shared"

const reactiveMap = new WeakMap()

enum ReactiveFlags {
  IS_REACTIVE = "__pumu_isReactive"
}

export function reactive(target) {
  return createReactiveObject(target)
}

const proxyHandler: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
  },

  set(target, key, newValue, receiver) {
    return true
  },
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

  const proxy = new Proxy(target, proxyHandler)
  reactiveMap.set(target, proxy)
  return proxy
}
