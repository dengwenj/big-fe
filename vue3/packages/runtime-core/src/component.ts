import { proxyRefs, reactive } from "@vue/reactivity"
import { hasOwn, isFunction, ShapeFlags } from "@vue/shared"

/**
 * 创建组件实例
 * @param vnode type类似是组件的虚拟dom
 * @returns 组件实例(对象)
 */
export function createComponentInstance(vnode, parent) {
  const instance = {
    data: null,
    isMounted: false, // 是否挂载完成
    vnode, // 组件的虚拟节点
    update: null, // 组件的更新函数
    subTree: null, // 组件 render 返回的虚拟节点
    propsOptions: vnode.type.props, // 组件实例对象上的 props,
    attrs: {}, // 所有属性 - propsOptions = attrs
    props: {}, // 响应式的，组件实例对象上的 props
    slots: {}, // 插槽
    component: null,
    proxy: null, // 用来代理 props attrs data 让用户更方便的使用
    render: null, // 组件实例的 render
    setupState: {}, // setup 函数返回的数据
    exposed: null, // 暴露
    parent, // 父组件 实例
    provides: parent ? parent.provides : Object.create(null),
    ctx: {} as any, // 如果是 keepalive 组件，就将 dom api 放入到这个属性上
  }

  return instance
}

const initProps = (instance, rawProps) => {
  const props = {}
  const attrs = {}
  const propsOptions = instance.propsOptions || {}
  for (const key in rawProps) {
    const value = rawProps[key]
    if (key in propsOptions) {
      props[key] = value
    } else {
      attrs[key] = value
    }
  }
  instance.props = reactive(props) // vue3 里面这个没有用深度代理
  instance.attrs = attrs
}

const publicProperty = {
  $attrs: (instance) => instance.attrs,
  $slots: (instance) => instance.slots
}
const handler = {
  get(target, key, receiver) {
    // data props
    // data.name props.ww 全都变成代理  proxy.name 就会去访问 data.name, proxy.ww 就会去访问 props.ww
    const { data, props, setupState } = target

    // 优先级 setup、props、attrs、data选项

    // setup 中返回的对象
    if (setupState && hasOwn(setupState, key)) {
      return setupState[key]
    }

    // props
    if (props && hasOwn(props, key)) {
      return props[key]
    }

    // $slots $attrs 无法修改，只读
    const getter = publicProperty[key] // 不同的属性有不同的策略
    if (getter) {
      return getter(target)
    }

    // data
    if (data && hasOwn(data, key)) {
      return data[key]
    }
  },
  set(target, key, newValue, receiver) {
    const { data, props, setupState } = target

    // setup 中返回的对象
    if (setupState && hasOwn(setupState, key)) {
      setupState[key] = newValue
      return true
    }

    // props
    if (props && hasOwn(props, key)) {
      console.warn(`props.${key.toString()} is readonly`)
      return false
    }

    // data
    if (data && hasOwn(data, key)) {
      data[key] = newValue
    }

    return true
  },
}

const initSlots = (instance, slots) => {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = slots 
  } else {
    instance.slots = {}
  }
}

/**
 * 给实例的属性赋值
 * 组件的儿子就是插槽
 */
export function setupComponent(instance) {
  const { type, props, children } = instance.vnode // 组件的虚拟dom

  // 初始化属性
  initProps(instance, props)

  // 初始化插槽
  initSlots(instance, children)

  // 组件的代理对象
  instance.proxy = new Proxy(instance, handler)

  const { data, render, setup } = type // 组件对象(h函数传递的第一个参数是对象)

  if (setup) {
    // setup 中的上下文
    const setupContext = {
      slots: instance.slots,
      attrs: instance.attrs,
      expose(value: Record<string, any>) {
        instance.exposed = value
      },
      emit(event: string, ...payload: any[]) {
        const eventName = `on${event[0].toUpperCase()}${event.slice(1)}` // onMyEvent
        props[eventName]?.(...payload)
      }
    }

    setCurrentInstance(instance)
    const res = setup(instance.props, setupContext)
    unsetCurrentInstance()
    // 根据 setup 不同的返回值做不同处理
    if (isFunction(res)) {
      instance.render = res
    } else {
      instance.setupState = proxyRefs(res) // 自动脱 ref，不用点.value
    }
  }

  if (data !== undefined && !isFunction(data)) {
    console.warn('data must a function')
  }
  if (isFunction(data)) {
    // 状态，组件可以基于自己的状态重新渲染 effect
    // data 中也可以访问 props
    instance.data = reactive(data.call(instance.proxy))
  }

  if (!instance.render) {
    // 这是配置项中的 render
    instance.render = render
  }
}

export let currentInstance = null
export const getCurrentInstance = () => {
  return currentInstance
}
export const setCurrentInstance = (instance) => {
  currentInstance = instance
}
export const unsetCurrentInstance = () => {
  currentInstance = null
}
