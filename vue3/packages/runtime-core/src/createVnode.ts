import { isFunction, isObject, isString, ShapeFlags } from "@vue/shared"

export function isVnode(vnode) {
  return !!vnode.__v_isVnode
}

export const Text = Symbol('Text')

export const Fragment = Symbol('Fragment')

export function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key
}

export function createVnode(type, props, children, patchFlag) {
  const shapeFlag = isString(type) 
    ? ShapeFlags.ELEMENT // 元素
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT // 有状态的组件
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    shapeFlag,
    el: null, // 虚拟节点对应的真实节点是谁
    key: props?.key, // diff 算法后面需要的 key
    ref: props?.ref,
    patchFlag,
  }

  if (currentBlock && patchFlag > 0) {
    currentBlock.push(vnode);
  }

  // []
  if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else if (isObject(children)) {
    vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN // 插槽
  } else {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
  return vnode
}

let currentBlock = null;
export function openBlock() {
  currentBlock = []; // 用于收集动态节点的
}
export function closeBlock() {
  currentBlock = null;
}
export function setupBlock(vnode) {
  vnode.dynamicChildren = currentBlock; // 当前elementBlock会收集子节点，用当前block来收集
  closeBlock();
  return vnode;
}
// block 有收集虚拟节点的功能
export function createElementBlock(type, props, children, patchFlag?) {
  const vnode = createVnode(type, props, children, patchFlag);
  // if (currentBlock) {
  //   currentBlock.push(vnode);
  // }
  return setupBlock(vnode);
}
export function toDisplayString(value) {
  return isString(value)
    ? value
    : value == null
    ? ""
    : isObject(value)
    ? JSON.stringify(value)
    : String(value);
}
export { createVnode as createElementVNode };
