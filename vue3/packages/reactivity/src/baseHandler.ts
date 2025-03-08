import { isObject } from "@vue/shared"
import { track, trigger } from "./reactiveEffect"
import { reactive } from './reactive'

export enum ReactiveFlags {
  IS_REACTIVE = "__pumu_isReactive"
}

const person = {
  name: '朴睦',
  get cName() {
    return this.name + "25"
  }
}

const p = new Proxy(person, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver)
    // return target[key] // person.name 不会触发，因为 target 没有被代理，所以不会触发，要用代理对象去取才会走getter
  },
  set(target, key, val, receiver) {
    return Reflect.set(target, key, val, receiver)
  }
})
// console.log(p.cName)


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
