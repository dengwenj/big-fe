import { activeEffect } from "./effect"

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
    const _effect = activeEffect[activeEffect.length - 1]
    if (_effect) {
      
    }
    return Reflect.get(target, key, receiver) // Reflect.get(target, key, receiver) === receiver[key]，但它不会递归调用
  },

  set(target, key, newValue, receiver) {
    // 找到属性，让对应的 effect 重新执行
    // 派发更新，当修改了属性去调用函数
    return Reflect.set(target, key, newValue, receiver)
  },
}


// 收集依赖是 Map 结构，key 是对象，value 是每个对象里面的key收集的依赖(effect)
// {
//   { name: 'pumu', age: 25 }: {
//     name: [effect1, effect2],
//     age: [effect1]
//   }
// }
