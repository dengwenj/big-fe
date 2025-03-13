import { currentInstance, setCurrentInstance, unsetCurrentInstance } from './component'

/**
 * 组件的生命周期
 */
export enum LifeCycle {
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u'
}

function createHook(type: LifeCycle) {
  // 先把每个 currentInstance 保存上，闭包。名叫：target
  return (hook: () => void) => {
    // target 就是当前的实例
    let target = currentInstance

    // 生命周期只能在组件里面使用
    if (target) {
      if (!target[type]) {
        target[type] = [] 
      }
      // 包裹一下，防止在生命周期的回调函数里获取 getCurrentInstance 拿不到
      const wrapHook = () => {
        setCurrentInstance(target)
        hook()
        unsetCurrentInstance()
      }
      target[type].push(wrapHook) 
    }
  }
}

export const onBeforeMount = createHook(LifeCycle.BEFORE_MOUNT)
export const onMounted = createHook(LifeCycle.MOUNTED)
export const onBeforeUpdate = createHook(LifeCycle.BEFORE_UPDATE)
export const onUpdated = createHook(LifeCycle.UPDATED)

export function invokeLifeCycleHooks(hooks: (() => void)[]) {
  for (const hook of hooks) {
    hook()
  }
}
