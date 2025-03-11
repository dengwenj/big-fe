import { isString, ShapeFlags } from "@vue/shared"

export function isVnode(vnode) {
  return !!vnode.__v_isVnode
}

export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment')

export function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}

export function createVnode(type, props, children) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    shapeFlag,
    el: null, // 虚拟节点对应的真实节点是谁
    key: props?.key // diff 算法后面需要的 key
  }

  // []
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
  return vnode
}
