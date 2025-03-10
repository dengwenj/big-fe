import { isObject } from "@vue/shared"
import { createVnode, isVnode } from "./createVnode"

/**
 * 创建虚拟 dom
 * 
 * h(类型)
 * 
 * h(类型，属性)
 * h(类型，字符串)
 * h(类型，vnode)
 * h(类型，数组)
 * 
 * h(类型，属性，字符串)
 * h(类型，属性，vnode)
 * h(类型，属性，数组)
 * h(类型，属性，值，值，值，值)
 */
export function h(type, propsOrChildren?, children?) {
  const len = arguments.length

  // 参数归一化后再传递
  // 属性，字符串，vnode，数组
  if (len === 2) {
    // 属性，vnode
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      // vnode
      if (isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren])
      }
      // 属性
      return createVnode(type, propsOrChildren, null)
    }
    // 字符串，数组
    return createVnode(type, null, propsOrChildren)
  } else {
    if (len > 3) {
      children = [...arguments].slice(2)
    }
    // == 3 或者 == 1

    if (len === 1) {
      propsOrChildren = null
      children = null
    } else if (len === 3 && isVnode(children)) {
      children = [children]
    }

    return createVnode(type, propsOrChildren, children)
  }
}
