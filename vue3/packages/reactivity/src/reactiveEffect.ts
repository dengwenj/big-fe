import { activeEffect, targetEffects } from "./effect"

// 用weakmap保存的依赖，结构如下
export const targetMap = new WeakMap()
// {
//   { name: 'pumu', age: 25 }: {
//     name: [effect1, effect2],
//     age: [effect1]
//   }
// }


/**
 * 收集依赖
 * @param target 
 * @param key 
 */
export function track(target: object, key: any) {
  // effect 回调函数用了多次一样的属性，只保存一个 effect
  const _effect = activeEffect[activeEffect.length - 1]
  if (_effect) {
    let idx = -1
    if (targetMap.has(target)) {
      const data = targetMap.get(target)
      if (data[key]) {
        data[key].push(_effect)
        idx = data[key].length - 1
      } else {
        data[key] = [_effect]
        idx = 0
      } 
    } else {
      targetMap.set(target, {
        [key]: [_effect]
      })
      idx = 0
    }
    _effect.setCleanPreEffect(_effect, target, {[key]: idx})
  }
}
console.log(targetMap)

/**
 * 修改了属性，派发更新
 * @param target 
 * @param key 
 * @param oldValue 
 * @param newValue 
 */
export function trigger(target: object, key: any, oldValue: any, newValue: any) {
  if (!targetMap.has(target)) {
    return
  }

  const data = targetMap.get(target)
  if (data[key]) {
    // 更新
    targetEffects([...data[key]]) // 这里不能传引用，不然 push 的时候添加(收集依赖的时候会 push)，会一直循环
  }
}


// 收集依赖是 Map 结构，key 是对象，value 是每个对象里面的key收集的依赖(effect)
// {
//   { name: 'pumu', age: 25 }: {
//     name: [effect1, effect2],
//     age: [effect1]
//   }
// }
