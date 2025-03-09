import { nodeOps } from './nodeOps'
import patchProp from './patchProp'
import { createRenderer } from '@vue/runtime-core'

// 合并
const renderOptions = {
  ...nodeOps,
  patchProp
}

export const render = (vNode, container) => {
  // 默认调用内置的
  return createRenderer(renderOptions).render(vNode, container)
}

export * from '@vue/runtime-core'
