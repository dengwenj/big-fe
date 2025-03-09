import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from './effect'
import { isReactive } from './reactive'
import { isRef } from './ref'

/**
 * source 都要去转换成函数(effect)执行 主要是去收集依赖的，看哪些属性用的了这个回调函数，
 * 当修改属性时，就会调用调度器函数，然后在调度器函数里做一些想做的事，比如：执行 watch 的第二个参数(callback)
 */
export function watch(source, cb, options = {} as any) {
  return doWatch(source, cb, options)
}

export function watchEffect(source, options = {} as any) {
  // 没有 cb 就是 watchEffect
  return doWatch(source, null, options)
}

function doWatch(source, cb, options) {
  // source 必须是 reactive，ref，getter
  let flag = false
  if (
    // Object.prototype.toString.call(source) === '[object Proxy]' 
    isReactive(source) || isRef(source) || isFunction(source)
  ) {
    flag = true
  }
  if (!flag) {
    console.warn(`source 必须是 reactive ref getter(effect)`)
    return
  }

  // source 参数归一化，变成函数 source => getter
  let getter = source
  if (isObject(source)) {
    // 收集依赖
    getter = () => forEachProperty(source, options.deep)
  }

  let oldValue

  // 调度器，这里面去执行 watch 的回调函数
  const job = () => {
    const newValue = effect.run()
    if (isFunction(cb)) {
      // 执行 watch 的第二个参数，数据变化后会调用这个函数
      cb(newValue, oldValue)
      oldValue = newValue 
    }
  }
  const effect = new ReactiveEffect(getter, job)

  if (isFunction(cb)) {
    // 立即先执行一次 watch 的第二个参数回调函数
    if (options.immediate) {
      job()
    } else {
      oldValue = effect.run() // 会去执行 getter(effect)
    }
  } else {
    // watchEffect
    effect.run()
  }

  const unwatch = () => {
    effect.stop()
  }

  return unwatch
}

/**
 * 作用：读取属性就会触发 get 函数，就会去收集依赖
 */
function forEachProperty(source, deep) {
  // source 为一个对象

  // source 为 ref 对象时，直接访问 value 就行了
  if (isRef(source)) {
    return source.value
  }

  // source 为 reactive
  // deep: false 只遍历第一层，deep 为 true 深度遍历
  for (const key in source) {
    // 读取属性就会触发 get 函数，就会去收集依赖
    if (isObject(source[key]) && deep) {
      forEachProperty(source[key], deep)
    }
  }
  return source
}
