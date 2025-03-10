import { ShapeFlags } from "@vue/shared"
import { isSameVnode } from './createVnode'

/**
 * 渲染器，可以把虚拟 dom 渲染成真实 dom
 */
export function createRenderer(renderOptions) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderOptions

  const mountChildren = (ele, children) => {
    for (const item of children) {
      patch(null, item, ele)
    }
  }

  const mountElement = (n2, container) => {
    const { shapeFlag, type, children, props }  = n2

    const ele = hostCreateElement(type)
    // 第一次渲染的时候我们让虚拟节点和真实 dom 关联起来 vnode.el = 真实dom
    // 第二次渲染新的 vnode，可以和上一次的 vnode 做对比，之后更新对应的 el 元素，可以再复用这个 dom 元素
    n2.el = ele
    if (props) {
      for (const key in props) {
        hostPatchProp(ele, key, null, props[key])
      }
    }

    // 儿子是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(ele, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 儿子是数组
      mountChildren(ele, children)
    }

    hostInsert(ele, container)
  }

  const processElement = (n1, n2, container) => {
    // 说明是初始化
    if (n1 === null) {
      mountElement(n2, container)
    } else {
      // preVnode 和 vnode 的类型和 key 都一致说明是相同的节点
      // 复用，更新属性和内容就行
      patchElement(n1, n2, container)
    }
  }

  const patchProps = (oldProps, newProps, el) => {
    // 新属性添加
    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key])
    }

    for (const key in oldProps) {
      // 新属性里面没有旧属性的就删除
      if (!newProps[key]) {
        hostPatchProp(el, key, oldProps[key], null) 
      }
    }
  }

  const patchChildren = (n1, n2, container) => {
    console.log(n1, n2, container)
  }

  const patchElement = (n1, n2, container) => {
    const el = n2.el = n1.el
    // 更新属性和内容就行
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    patchProps(oldProps, newProps, el)

    patchChildren(n1, n2, container)
  }

  // 渲染和更新都走这里
  const patch = (n1, n2, container) => {
    // 说明是同一个 vnode
    if (n1 === n2) {
      return
    }

    // preVnode 和 vnode 的类型和 key 都一致说明是相同的节点
    // 如果不是，则需要删除老的换新的
    if (n1 && !isSameVnode(n1, n2)) {
      // 删除老的，换成新的
      unmount(n1)
      n1 = null
      container._vnode = n2
    }

    processElement(n1, n2, container)
  }

  // 删除
  const unmount = (vnode) => {
    hostRemove(vnode.el)
  }

  // 多次调用 render 会进入虚拟节点的比较，再进行更新
  const render = (vnode, container) => {
    if (vnode === null) {
      // 有之前的 vnode
      if (container._vnode) {
        // 删除
        unmount(container._vnode)
      }
    }

    // 将虚拟节点变成真实节点渲染
    patch(container._vnode || null, vnode, container)
    // 把之前的vnode保存，后面会做 diff
    container._vnode = vnode
  }

  return {
    render
  }
}
