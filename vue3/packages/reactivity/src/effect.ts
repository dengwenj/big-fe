import { targetMap } from "./reactiveEffect"

/**
 * 首次会执行一次 effect 中的回调函数，后面当数据变化时再会执行 effect 中的回调函数
 * @param fn callback
 * @param options 作用是可以调度执行，可以先执行自己的逻辑，然后自己 runner 去执行 effect中的回调函数 (AOP 思想，切面)
 */
export function effect(fn: () => void, options: { schedulder: () => void }) {
  // 创建一个响应式 effect
  const _effect = new ReactiveEffect(fn, () => {
    // schedulder 当数据改变时要执行 effect
    _effect.run()
  })

  // 首次要执行一次 effect
  _effect.run()

  if (options) {
    // _effect 上的属性被 options 覆盖了
    Object.assign(_effect, options)
  }

  const runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

// export let activeEffect = null
// 使用栈的情况是：当 effect 里面嵌套 effect 时用一个变量保存有问题，所以用栈
export const activeEffect: ReactiveEffect[] = []

class ReactiveEffect {
  // 创建的 effect 是响应式的
  public active = true

  public isRunning = false

  // 记录之前的
  private cleanPreEffect: Map<ReactiveEffect, Map<object, Record<string, number>>> = new Map()

  constructor(public fn: () => void, public schedulder: () => void) { }

  // 执行 fn 函数，这个 fn 函数就是 effect 中的回调函数
  run() {
    if (!this.active) {
      return this.fn()
    }

    // 收集依赖：当 effect 函数中用了，就要收集该 effect
    // 用全局变量保存当前属性使用了 effect
    try {
      // activeEffect = this
      activeEffect.push(this)

      // 执行回调函数之前，先把之前的 effect 清除掉
      this.clearEffect()

      this.isRunning = true
      return this.fn()
    } finally {
      // 执行完后置为空
      // activeEffect = null
      // 删除最后一个，函数调用栈，后进先出
      activeEffect.pop()
      this.isRunning = false
    }
  }

  public getCleanPreEffect() {
    return this.cleanPreEffect
  }

  public setCleanPreEffect(
    effect: ReactiveEffect, 
    target: object, 
    keyAndIndex: Record<string, number>
  ): void {
    // 以前存过 effect 了
    if (this.cleanPreEffect.has(effect)) {
      const targetData = this.cleanPreEffect.get(effect)
      if (targetData.has(target)) {
        // 之前的
        const preKeyAndIndex = targetData.get(target)

        // 对象合并起来
        targetData.set(target, {
          ...preKeyAndIndex,
          ...keyAndIndex
        })
      } else {
        targetData.set(target, keyAndIndex)
      }
    } else {
      const targetData = new Map<object, Record<string, number>>()
      targetData.set(target, keyAndIndex)
      this.cleanPreEffect.set(effect, targetData)
    }
  }

  /**
   * vue 里面做的是拿老的依赖和新的依赖比对，没用的清除
   * 我这里做的是直接把之前的依赖清除，没有比对
   */
  private clearEffect(): void {
    // 清除这个 effect 实例所有
    const targetToKeyAndIndex = this.cleanPreEffect.get(this)
    if (!targetToKeyAndIndex) {
      return
    }
    targetToKeyAndIndex.forEach((val, target) => {
      // console.log(val, 'val')
      const effectsObj = targetMap.get(target)
      const keys = Object.keys(val)
      for (const key of keys) {
        const effects = effectsObj[key] as ReactiveEffect[]
        const idx = val[key]
        // 置为 null
        effects.splice(idx, 1, null)
      }
    })

    // 执行完后清除 null 的元素
  }
}

export function targetEffects(effects: ReactiveEffect[]) {
  for (const effect of effects) {
    if (effect) {
      // 是否正在执行
      if (!effect.isRunning) {
        effect.schedulder() // 执行这个方法就会只执行 _effect.run() 就会触发 effect 里的回调方法 
      }
    }
  }
}











// effect(() => {
//   app.innerHTML = `姓名：${state.name} 年龄：${state.age}`
//   effect(() => {
//     console.log(state.age)
//   })
//   console.log(state.name)
// })

// cleanPreEffect 的结构
// {
//   ReactiveEffect: {
//     target: {
//       age: 0,
//       name: 0
//     },
//     target: {
//       ww: 0
//     }
//   },
//   ReactiveEffect: {
//     target: {
//       age: 1
//     }
//   }
// }

// const map = new Map()
// const map1 = map.get(this)
// const val = targetMap.get(map1[0])
// const arr = Object.keys(map1[1])
// for (const key of arr) {
//   const effects = val[key]
//   const idx = map1[1][key]
//   effects.split(idx, 1)
// }