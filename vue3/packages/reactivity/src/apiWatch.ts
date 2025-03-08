import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect } from './effect'

export function watch(source, cb, options = {} as any) {
  return doWatch(source, cb, options)
}

function doWatch(source, cb, options) {
  // source 必须是 reactive，ref，getter
  let flag = false
  if (
    Object.prototype.toString.call(source) === '[object Proxy]' 
    || source.__v_isRef 
    || isFunction(source)
  ) {
    flag = true
  }
  if (!flag) {
    console.warn(`source 必须是 reactive ref getter`)
    return
  }

  // source 参数归一化，变成函数 source => getter
  let getter = source
  if (isObject(source)) {
    // 收集依赖
    getter = () => forEachProperty(source, options.deep)
  }

  let oldValue

  if (options.immediate) {
    cb(oldValue, source)
  }

  // 调度器，这里面去执行 watch 的回调函数
  const job = () => {
    const newValue = effect.run()
    // 执行 watch 的第二个参数，数据变化后会调用这个函数
    cb(newValue, oldValue)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(getter, job)
  oldValue = effect.run()
}

/**
 * 作用：读取属性就会触发 get 函数，就会去收集依赖
 */
function forEachProperty(source, deep) {
  // source 为一个对象

  // source 为 ref 对象时，直接访问 value 就行了
  if (source.__v_isRef) {
    return source.value
  }

  // deep: false 只遍历第一层，deep 为 true 深度遍历
  for (const key in source) {
    // 读取属性就会触发 get 函数，就会去收集依赖
    if (isObject(source[key]) && deep) {
      forEachProperty(source[key], deep)
    }
  }
  return source
}
