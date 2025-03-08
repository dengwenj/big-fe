import { isFunction } from "@vue/shared";
import { ReactiveEffect } from './effect'
import { track, trigger } from "./reactiveEffect";

/**
 * 原理:
 * 1、计算属性维护了一个 dirty 属性，默认就是 true，稍后运行过一次会将 dirty 变为 false，并且稍后依赖的值变化后会再次让 dirty 变为 true
 * 2、计算属性也是一个 effect，依赖的属性会收集这个计算属性，当前值变化后，会让 computedEffect 里面 dirty 变为 true
 * 3、计算属性具备收集能力的，可以收集对应的 effect，计算属性中依赖的值变化后会触发 effect 重新执行（间接的）
 */
export function computed(getterOrOptions) {
  // 参数归一化，就是把传递不同的参数，归一同一样的
  let getter
  let setter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  // 返回计算属性 ref
  return new ComputedRefImpl(getter, setter)
}

class ComputedRefImpl {
  private static VALUE = 'value'

  // 回调函数返回的值
  public _value

  // 这个 effect 是 computed 里面 getter 的 effect。computed(() => { // 相当于这个回调 })
  public effect: ReactiveEffect

  constructor(public getter, public setter) {
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      // 第二个参数是个调度器
      () => {
        console.log(`
          computed 里面依赖的属性发生了变化执行这里，
          原先这里会调用 this.effect.run，现在不直接调用
        `)
        // 派发更新。派发 effect 和 computed 的更新（3、计算属性具备收集能力的，可以收集对应的 effect，计算属性中依赖的值变化后会触发 effect 重新执行（间接的））
        triggerComputedRef(this, ComputedRefImpl.VALUE, null, null) // 这里一调触发计算属性对应的 effect 回调函数执行
      }
    )
  }

  get value() {
    // 是否为脏值，为脏值就重新 run，反之走缓存
    if (this.effect.dirty) {
      // 这里执行的就是上面 37 行，当访问计算属性时去调用
      this._value = this.effect.run()
    }

    // effect(() => {
    //   console.log(computedReturnRefVal.value)
    //   console.log(computedReturnRefVal.value)
    //   console.log(computedReturnRefVal.value)
    // })
    // 收集依赖（收集的是：effect 和 computed 返回值 关联的依赖）（3、计算属性具备收集能力的，可以收集对应的 effect，计算属性中依赖的值变化后会触发 effect 重新执行（间接的））
    trackComputedRef(this, ComputedRefImpl.VALUE)
    return this._value
  }

  set value(val) {
    // computed 中的 set 属性
    this.setter(val)
  }
}

// 收集依赖
export function trackComputedRef(target: ComputedRefImpl, key) {
  track(target, key)
}

// 派发更新
export function triggerComputedRef(target: ComputedRefImpl, key, newValue, oldValue) {
  trigger(target, key, newValue, oldValue)
}
