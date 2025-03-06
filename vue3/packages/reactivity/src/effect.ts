/**
 * 首次会执行一次 effect 中的回调函数，后面当数据变化时再会执行 effect 中的回调函数
 * @param fn callback
 * @param options 
 */
export function effect(fn: () => void, options) {
  // 创建一个响应式 effect
  const _effect = new ReactiveEffect(fn, () => {
    // schedulder 当数据改变时要执行 effect
    _effect.run()
  })

  // 首次要执行一次 effect
  _effect.run()
}

// export let activeEffect = null
// 使用栈的情况是：当 effect 里面嵌套 effect 时用一个变量保存有问题，所以用栈
export const activeEffect: ReactiveEffect[] = []

class ReactiveEffect {
  constructor(public fn: () => void, public schedulder: () => void) {
  }

  // 执行 fn 函数，这个 fn 函数就是 effect 中的回调函数
  run() {
    // 收集依赖：当 effect 函数中用了，就要收集该 effect
    // 用全局变量保存当前属性使用了 effect
    try {
      // activeEffect = this
      activeEffect.push(this)
      return this.fn()
    } finally {
      // 执行完后置为空
      // activeEffect = null
      // 删除最后一个，函数调用栈，后进先出
      activeEffect.pop()
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