import { toReactive } from './reactive'
import { track, trigger } from './reactiveEffect'

/**
 * ref 可以传普通值，在内部会包裹一层，会把变成对象
 * ref 必须要点 value 的原因是在内部包裹了一个对象，对象有个属性叫 value
 * 
 * ref 能这么简单的完成，就是因为 **收集依赖的方法** 和 **派发更新的方法** 封装好了直接调用就行了
 * 当修改 ref 的值时会触发 effect 中的回调函数
 */
export function ref(value: any) {
  return createRef(value)
}

function createRef(value) {
  return new RefImpl(value)
}

class RefImpl {
  private static VALUE = 'value'

  public __v_isRef = true

  public _value // 用来保存 ref 的值

  constructor(public rawValue) {
    // rawValue 是对象的话转成 proxy
    this._value = toReactive(rawValue)
  }

  get value() {
    // 收集依赖
    trackRef(this, RefImpl.VALUE)
    return this._value
  }

  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue
      this._value = newValue
      // 派发更新
      triggerRef(this, RefImpl.VALUE, newValue, this.rawValue)
    }
  }
}

// 收集依赖
function trackRef(target: RefImpl, key) {
  track(target, key)
}

// 派发更新
function triggerRef(target, key, newValue, oldValue) {
  trigger(target, key, newValue, oldValue)
}

/**
 * toRef toRefs，就是让 reactive 对象变成 ref 对象，相当于做了一个代理
 * 为了防止 reactive 对象解构的时候丧失响应式
 */
// 这样解构再去修改 name 的值会丧失响应式，用 toRef 或者 toRefs 来处理
// let { name } = reactive({ name: '朴睦' })
// effect(() => {
//   app.innerHTML = name
// })
// setTimeout(() => {
//   name = "哈哈"
// }, 1000);

export function toRef(target: object, key: string) {
  return new ObjectRefImpl(target, key)
}

export function toRefs(target: object) {
  const res = {}
  for (const key in target) {
    // 循环给 key 绑定上 toRef
    res[key] = toRef(target, key)
  }
  return res
}

class ObjectRefImpl {
  // ref 的标识
  public __v_isRef = true

  constructor(public _target, public _key) { }

  get value() {
    return this._target[this._key]
  }

  set value(newValue) {
    this._target[this._key] = newValue
  }
}
