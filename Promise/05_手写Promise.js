const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

/**
 * 把回调函数放入微队列
 * @param {Function} callback 
 */
function runMicroTask(callback) {
  queueMicrotask(callback)
}

/**
 * 是否满足 Promise A+ 规范
 */
function isPromise(obj) {
  return !!(obj && typeof obj === 'object' && typeof obj.then === 'function')
}

class MyPromise {
  /**
   * 创建 Promise 对象
   * @param {*} executor 任务执行器，立即执行
   */
  constructor(executor) {
    this._state = PENDING
    this._value = undefined
    // 处理函数放到微队列
    this._handlers = []
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      // 执行器里面报错
      this._resolve(error)
    }
  }

  /**
   * 执行队列
   */
  _runHandlers() {
    if (this._state === PENDING) {
      return
    }

    while (this._handlers[0]) {
      const handler = this._handlers[0]
      this._runOneHandler(handler)
      // 执行完一个删除一个
      this._handlers.shift()
    }
  }

  /**
   * 执行某一个 handler
   */
  _runOneHandler({ executor, state, resolve, reject }) {
    if (state !== this._state) {
      return
    }
    // 放入微队列
    runMicroTask(() => {
      // then 里面的回调函数不是一个函数
      if (typeof executor !== 'function') {
        // 根据上一个 Promise 的状态来
        this._state === FULFILLED ? resolve(this._value) : reject(this._value)
        return
      }
      // then 里面的回调函数是一个函数
      try {
        const res = executor(this._value)
        // 返回值是个 Promise
        if (isPromise(res)) {
          res.then(resolve, reject)
        } else {
          resolve(res)
        }
      } catch (error) {
        reject(error) 
      }
    })
  }

  /**
   * 把执行函数放入队列里面
   * @param {Function} executor 
   * @param {string} state 
   * @param {Function} resolve 
   * @param {Function} reject 
   */
  _pushHandler(executor, state, resolve, reject) {
    this._handlers.push({
      executor,
      state,
      resolve,
      reject
    })
  }

  /**
   * Promise A+ 规范的 then
   * 返回一个新的 Promise
   */
  then(onFulFilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this._pushHandler(onFulFilled, FULFILLED, resolve, reject)
      this._pushHandler(onRejected, REJECTED, resolve, reject)
      // 可能 resolve 比 then 先执行
      this._runHandlers()
    })
  }

  /**
   * 修改状态和数据
   * @param {*} state 
   * @param {*} value 
   */
  _changeStateValue(state, value) {
    // 已经已决了
    if (this._state !== PENDING) {
      return
    }
    this._state = state
    this._value = value
    // 执行 handler
    this._runHandlers()
  }

  /**
   * 成功执行的方法，修改状态和值
   * @param {*} data 相关的数据
   */
  _resolve(data) {
    this._changeStateValue(FULFILLED, data)
  }

  /**
   * 失败执行的方法，修改状态和值
   * @param {*} reason 失败的原因
   */
  _reject(reason) {
    this._changeStateValue(REJECTED, reason)
  }
}

const p = new MyPromise((resolve, reject) => {
  resolve("123")
  setTimeout(() => {
    
  }, 1000);
})

const p1 = p.then(() => {
  const ww = new MyPromise((reslove, reject) => {
    reslove("成功")
  })
  // ww.then(reslove, reject)
  return ww
})
setTimeout(() => {
  console.log(p1, 'p1')
}, 1500)

// p.then(function a1() {
//   console.log("a1")
// }, function a2() { })
// p.then(function b1() {
//   console.log("a2")
// }, function b2() {})
// console.log(p)
