import { isFunction } from "@vue/shared";
import { h } from './h'
import { ref } from "@vue/reactivity";

/**
 * 异步组件
 */
type AsyncComponentLoader = () => Promise<any>
interface AsyncComponentOptions {
  loader?: AsyncComponentLoader
  loadingComponent?: any
  errorComponent?: any
  delay?: number
  timeout?: number
  suspensible?: boolean
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number
  ) => any
}
export function defineAsyncComponent(options: AsyncComponentOptions | AsyncComponentLoader) {
  // 参数归一化
  if (isFunction(options)) {
    let loader = options
    options = {
      loader: loader as AsyncComponentLoader
    }
  }
  const { loader, timeout, errorComponent, delay = 0, loadingComponent, onError } = options as AsyncComponentOptions

  const loaded = ref(false)
  const error = ref(false)
  const loading = ref(false)

  async function loadFunc() {
    return loader().catch((err) => {
      return new Promise((resolve, reject) => {
        if (onError) {
          const retry = () => {
            resolve(loadFunc())
          }
          const fail = () => {
            reject()
          }
          onError(err, retry, fail, ++attempts)
        }
      })
    })
  }

  let attempts = 0
  let comp = null
  loadFunc()
    .then((res) => {
      loaded.value = true
      // 说明是 import 的方式导入
      if (Object.prototype.toString.call(res) === '[object Module]') {
        comp = res.default
      } else {
        // 自己 resolve 的一个组件对象
        comp = res
      }
    })
    .catch((err) => {
      error.value = true
    })
    .finally(() => {
      loading.value = false
    })

  let errorComp
  if (timeout && errorComponent) {
    setTimeout(() => {
      error.value = true
      errorComp = h(errorComponent)
    }, timeout)
  } else {
    errorComp = h('div', '内部给出的 error 组件')
  }

  let loadingComp
  if (delay && loadingComponent) {
    setTimeout(() => {
      loading.value = true
      loadingComp = h(loadingComponent)
    }, delay)
  }

  return {
    setup() {
      return () => {
        if (loaded.value) {
          console.log("这里面")
          return h(comp)
        } else if (error.value) {
          return errorComp
        } else if (loading.value) {
          return loadingComp
        } else {
          // 最开始，空的
          return h('div', 'pedding')
        }
      }
    }
  }
}





// 37 行一样的例子 loadFunc 函数
// function fn() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // resolve 时 p2 的状态是 fulfilled，reject 时 p2 的状态是 rejected
//       // resolve('状态吸收') 
//       reject('状态吸收')
//     }, 2000)
//   })
// }
// const p2 = new Promise((resolve) => {
//   resolve(fn()) // p2 的状态不一定是成功的。要看 fn 返回的状态，若 fn 返回成功则成功，返回失败则失败
// })
// p2.then((res) => {
//   console.log('res :', res)
// }).catch((err) => {
//   console.log('err: ' + err) // 会进这，err 是 '状态吸收' 字符串
// })
