import { ShapeFlags } from "@vue/shared"

/**
 * 渲染器
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

  // 渲染和更新都走这里
  const patch = (n1, n2, container) => {
    // 说明是同一个 vnode
    if (n1 === n2) {
      return
    }

    // 说明是初始化
    if (n1 === null) {
      mountElement(n2, container)
      return
    }

    // 比较
  }

  // 多次调用 render 会进入虚拟节点的比较，再进行更新
  const render = (vnode, container) => {
    // 将虚拟节点变成真实节点渲染
    patch(container._vnode || null, vnode, container)
    // 把之前的保存，后面会做 diff
    container._vnode = vnode
  }

  return {
    render
  }
}
