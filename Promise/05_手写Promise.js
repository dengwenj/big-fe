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

class MyPromise {
  /**
   * 创建 Promise 对象
   * @param {*} executor 任务执行器，立即执行
   */
  constructor(executor) {
    this._state = PENDING
    this._value = undefined
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      // 执行器里面报错
      this._resolve(error)
    }
  }

  /**
   * Promise A+ 规范的 then
   * 返回一个新的 Promise
   */
  then(onFulFilled, onRejected) {
    return new Promise((resolve, reject) => {})
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
})
console.log(p)
