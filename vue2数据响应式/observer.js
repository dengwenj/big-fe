/**
 * 观察某个对象的所有属性
 */
function obServer(obj) {
  for (const key in obj) {
    let temp = obj[key]
    // 保存用我的函数
    const funs = []
    Object.defineProperty(obj, key, {
      get() {
        // 依赖收集，记录：是哪个函数在使用我
        if (window.__fun && !funs.includes(window.__fun)) {
          funs.push(window.__fun) 
        }
        return temp
      },
      set(val) {
        temp = val
        // 派发更新，执行用我的函数
        for (const fun of funs) {
          fun()
        }
      }
    })
  }  
}

function autoRun(fn) {
  window.__fun = fn
  fn()
  window.__fun = null
}