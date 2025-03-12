import { ShapeFlags } from "@vue/shared"
import { Fragment, isSameVnode, Text } from './createVnode'
import getSequence from "./seq"
import { ReactiveEffect } from "@vue/reactivity"
import { queueJob } from "./schedulder"
import { createComponentInstance, setupComponent } from "./component"

/**
 * 调用 h 函数 根据传入的参数 会创建出虚拟 dom(js 对象)
 * 然后再把虚拟 dom 传入 render 函数，render 函数就会根据 虚拟dom 生成 真实dom
 * 
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

  const mountElement = (n2, container, anchor) => {
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

    hostInsert(ele, container, anchor)
  }

  const processElement = (n1, n2, container, anchor) => {
    // 说明是初始化
    if (n1 === null) {
      mountElement(n2, container, anchor)
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

  const unmountChildren = (children) => {
    for (const vnode of children) {
      hostRemove(vnode.el)
    }
  }

  
  // const vnode1 = h(
  //   'h1',
  //   [
  //     h('div', { key: 'b' }, 'b'),
  //     h('div', { key: 'a' }, 'a'),
  //     h('div', { key: 'c' }, 'c')
  //   ]
  // )
  // const vnode2 = h(
  //   'h1',
  //   [
  //     h('div', { key: 'a' }, 'a'),
  //     h('div', { key: 'b' }, 'b'),
  //     h('div', { key: 'c' }, 'c'),
  //     h('div', { key: 'd' }, 'd'),
  //     h('div', { key: 'e' }, 'e'),
  //   ]
  // )
  // h 函数孩子都是数组的时候会进行 diff 算法
  // c1 c2 都是数组，diff 算法，全量 diff 全部都要比较还是比较消耗性能的
  // vue3 中分为两种 全量 diff（递归diff），快速 diff（靶向更新）-> 基于模版的
  const patchKeyedChildren = (c1, c2, el) => {
    // 1、减少比对范围，先从头开始比，在从尾部开始比较，确定不一样的范围
    // 2、从头比对，在从尾巴比对，如果有多余的或者新增的直接操作即可

    // 开始比对的索引
    let i = 0
    let e1 = c1.length - 1 // 第一个数组的尾部索引
    let e2 = c2.length - 1 // 第二个数组的尾部索引

    // [a, b, c]
    // [a, b, c, d, e]
    // 从头开始比
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      i++
    }

    // [a, b, c]
    // [a, b, c, d, e]
    // 从尾开始比
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--
      e2--
    }

    if (i > e1) {
      // 新的多
      if (i <= e2) {
        // 有插入的部分
        let nextPos = e2 + 1 // 当前下一个元素是否存在
        let anchor = c2[nextPos]?.el
        while (i <= e2) {
          patch(null, c2[i], el, anchor)
          i++
        }
      }
    } else if (i > e2) { // 老的多
      if (i <= e1) {
        while (i <= e1) {
          unmount(c1[i]) // 将元素一个一个删除
          i++
        }
      }
    } else {
      // a b c [d f e] g k
      // a b c [e d f h] g k
      let s1 = i
      let s2 = i

      const keyToNewIndexMap = new Map()

      let toBepatched = e2 - s2 + 1
      let newIndexToOldMapIndex = new Array(toBepatched).fill(0)

      for (let i = s2; i <= e2; i++) {
        const vnode = c2[i]
        keyToNewIndexMap.set(vnode.key, i)
      }
      for (let i = s1; i <= e1; i++) {
        const vnode = c1[i]
        // 通过 key 找到对应的索引
        const newIndex = keyToNewIndexMap.get(vnode.key)
        if (newIndex === undefined) {
          // 新的里面找不到，老的里面要删除
          unmount(vnode)
        } else {
          newIndexToOldMapIndex[newIndex - s2] = i + 1
          patch(vnode, c2[newIndex], el) // 复用
        }
      }

      const seq = getSequence(newIndexToOldMapIndex)
      let j = seq.length - 1
      // 调整顺序
      for (let i = toBepatched - 1; i >= 0; i--) {
        let newIndex = s2 + i
        let anchor = c2[newIndex + 1]?.el
        let vnode = c2[newIndex]
        if (!vnode.el) {
          patch(null, vnode, el, anchor)
        } else {
          if (i === seq[j]) {
            j--
          } else {
            hostInsert(vnode.el, el, anchor)
          }
        }
      }
    }
  }

  // 1、新的是文本，老的是数组移除老的
  // 2、新的是文本，老的也是文本，内容不相同替换
  // 3、老的是数组，新的是数组，全量 diff 算法
  // 4、老的是数组，新的不是数组，移除老的子节点
  // 5、老的是文本，新的是空
  // 6、老的是文本，新的是数组
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children
    const c2 = n2.children
    const preShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 1
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
        hostSetElementText(el, c2)
      } else if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 2
        hostSetElementText(el, c2) 
      }
    } else {
      // 3
      if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 全量 diff
          patchKeyedChildren(c1, c2, el)
        } else {
          unmountChildren(c1)
        }
      } else {
        if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '') 
        }

        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(el, c2)
        }
      }
    }
  }

  const patchElement = (n1, n2, container) => {
    const el = n2.el = n1.el
    // 更新属性和内容就行
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    patchProps(oldProps, newProps, el)

    patchChildren(n1, n2, el)
  }
  
  const processText = (n1, n2, container) => {
    if (n1 === null) {
      const textNode = hostCreateText(n2.children)
      n2.el = textNode
      hostInsert(n2.el, container)
    } else {
      // 复用
      const el = (n2.el = n1.el);
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  }

  const processFragment = (n1, n2, container) => {
    if (n1 === null) {
      mountChildren(container, n2.children)
    } else {
      patchChildren(n1, n2, container)
    }
  }

  const updateComponentPreRender = (instance, next) => {
    instance.next = null
    instance.vnode = next 
    updateProps(instance, instance.props, next.props)
  }

  function setupRenderEffect(instance, container, anchor) {
    const componentUpdateFn = () => {
      const { render, next } = instance

      let subTree
      // 初始化
      if (!instance.isMounted) {
        subTree = render.call(instance.proxy, instance.proxy)
        patch(null, subTree, container, anchor)
        instance.isMounted = true
      } else {
        // 说明是属性或者插槽更新
        if (next) {
          updateComponentPreRender(instance, next)
        }
        subTree = render.call(instance.proxy, instance.proxy)
        // 基于状态的组件更新 -> 就是组件对象里面的状态更新
        patch(instance.subTree, subTree, container, anchor)
      }
      // 保存下组件 render 返回的虚拟节点
      instance.subTree = subTree
    }

    const effect = new ReactiveEffect(componentUpdateFn, () => {
      // 异步更新组件
      queueJob(update)
    })

    const update = () => {
      effect.run()
    }
    update()
    instance.update = update
  }
  // 初始化组件
  const mountComponent = (vnode, container, anchor) => {
    // 1、先创建组件实例
    const instance = createComponentInstance(vnode)
    vnode.component = instance

    // 元素更新 n2.el = n1.el
    // 组件更新 n2.component.subTree.el = n1.component.subTree.el, subTree 就是 render 函数的返回值虚拟dom

    // 2、给实例的属性赋值
    setupComponent(instance)

    // 3、创建一个 effect
    setupRenderEffect(instance, container, anchor)
  }

  const hasPropsChange = (preProps, nextProps) => {
    const preKeys = Object.keys(preProps)
    const nextKeys = Object.keys(nextProps)

    // 长度不一样，说明 props 改变了
    if (preKeys.length !== nextKeys.length) {
      return true
    }

    // 看新的 props 的值是否和老的 props 的值一样
    for (const key of nextKeys) {
      if (nextProps[key] !== preProps[key]) {
        return true
      }
    }

    return false
  }

  const updateProps = (instance, preProps, nextProps) => {
    // 说明 props 修改过
    if (hasPropsChange(preProps, nextProps)) {
      // 用最新的 props
      for (const key in nextProps) {
        instance.props[key] = nextProps[key] 
      }

      // 把多余的 props 删除掉。即新的上面没有 老的上面有，就删除
      for (const key in preProps) {
        if (!(key in nextProps)) {
          delete instance.props[key]
        }
      }
    }
  }

  const shouldComponentUpdate = (n1, n2) => {
    // 组件属性是否变化，插槽是否有变化
    const { props: preProps, children: preChildren } = n1
    const { props: nextProps, children: nextChildren } = n2

    // 有插槽直接走重新渲染
    if (preChildren || nextChildren) {
      return true
    }

    if (preProps === nextProps) {
      return false
    }

    // 属性是否更新
    return hasPropsChange(preProps, nextProps)
  }

  const updateComponent = (n1, n2) => {
    // 获取到组件的实例
    const instance = (n2.component = n1.component)

    // 属性或插槽是否要更新
    if (shouldComponentUpdate(n1, n2)) {
      // 标记下，调用 update 时，有 next 说明是属性或者插槽更新
      instance.next = n2
      instance.update()
    }
  }

  // vue 组件的渲染
  const processComponent = (n1, n2, container, anchor) => {
    // n1, n2 是组件虚拟dom，它上面 type 是组件实例(对象)
    if (n1 === null) {
      // 组件首次加载
      mountComponent(n2, container, anchor)
    } else {
      // 进这里有一个前提：就是有子组件
      // 组件更新有三种方式（状态，属性，插槽）
      // 组件更新
      updateComponent(n1, n2)
    }
  }

  // 渲染和更新都走这里
  const patch = (n1, n2, container, anchor = null) => {
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

    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break;
      
      case Fragment:
        processFragment(n1, n2, container)
        break;
    
      default:
        if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor)
        } else {
          processElement(n1, n2, container, anchor)
        }
        break;
    }
  }

  // 删除
  const unmount = (vnode) => {
    if (vnode.type === Fragment) {
      unmountChildren(vnode.children)
    } else if (vnode.shapeFlag & ShapeFlags.COMPONENT) {
      // 组件卸载
      unmount(vnode.component.subTree)
    } else {
      hostRemove(vnode.el)
    }
  }

  // 多次调用 render 会进入虚拟节点的比较，再进行更新
  const render = (vnode, container) => {
    if (vnode === null) {
      // 有之前的 vnode
      if (container._vnode) {
        // 删除
        unmount(container._vnode)
      }
    } else {
      // 将虚拟节点变成真实节点渲染
      patch(container._vnode || null, vnode, container)
      // 把之前的vnode保存，后面会做 diff
      container._vnode = vnode
    }
  }

  return {
    render
  }
}
