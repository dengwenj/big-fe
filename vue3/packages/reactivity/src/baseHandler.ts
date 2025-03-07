import { isObject } from "@vue/shared"
import { track, trigger } from "./reactiveEffect"
import { reactive } from './reactive'

export enum ReactiveFlags {
  IS_REACTIVE = "__pumu_isReactive"
}

export const mutableHandler: ProxyHandler<any> = {
  // receiver 代理对象
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 当取值的时候，应该让响应式属性和 effect 映射起来
    // 收集依赖：谁用了我，保存函数
    track(target, key)

    const res = Reflect.get(target, key, receiver)
    // 递归代理，深度代理
    if (isObject(res)) {
      return reactive(res)
    }

    return res // Reflect.get(target, key, receiver) === receiver[key]，但它不会递归调用
  },

  set(target, key, newValue, receiver) {
    // 找到属性，让对应的 effect 重新执行
    const oldValue = target[key]
    const res = Reflect.set(target, key, newValue, receiver)
    if (oldValue !== newValue) {
      // 派发更新，当修改了属性去调用 effect 函数
      trigger(target, key, newValue, oldValue)
    }
    return res
  },
}


// 收集依赖是 Map 结构，key 是对象，value 是每个对象里面的key收集的依赖(effect)
// {
//   { name: 'pumu', age: 25 }: {
//     name: [effect1, effect2],
//     age: [effect1]
//   }
// }
