import { nodeOps } from './nodeOps'
import patchProp from './patchProp'

// 合并
const renderOptions = {
  ...nodeOps,
  patchProp
}

function createRenderer(renderOptions) {
  return {}
}

createRenderer(renderOptions)

export * from '@vue/reactivity'
export {
  renderOptions
}
