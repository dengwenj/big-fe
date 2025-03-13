import { currentInstance } from "./component";

export function provide(key, value) {
  // provide 只能在组件上使用
  if (!currentInstance) {
    return
  }

  // 父组件 provide
  const parentProvide = currentInstance.parent?.provides
  // 自己身上的 provide
  let provides = currentInstance.provides

  if (parentProvide === provides) {
    // 如果在子组件上新增了 provide 需要拷贝一份全新的
    provides = currentInstance.provides = Object.create(parentProvide) // 原型链改为 parentProvide
  }

  provides[key] = value
  // console.log(parentProvide, 'parentProvide')
  // console.log(provides, 'provides')
}

export function inject(key, defaultVal) {
  if (!currentInstance) {
    return
  }

  const provides = currentInstance.parent?.provides
  if (provides?.[key]) {
    return currentInstance.provides[key]
  } else {
    return defaultVal
  }
}
