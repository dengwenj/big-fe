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

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  /**
   * 无论是什么结果都会运行
   */
  finally(callback) {
    return this.then((data) => {
      callback()
      return data
    }, (reason) => {
      callback()
      throw reason
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

  /**
   * 返回一个已完成的 Promise
   * 1、传递的 data 本身就是 ES6 的 Promise 对象
   * 2、传递的 data 是 PromiseLike (Promise A+)，返回新的 Promise，状态和其保持一致
   * @param {any} data 
   * @returns 
   */
  static reslove(data) {
    if (data instanceof MyPromise) {
      return data
    }
    return new MyPromise((reslove, reject) => {
      if (isPromise(data)) {
        data.then(reslove, reject)
      } else {
        reslove(data)
      }
    })
  }

  /**
   * 返回已拒绝的 Promise
   * @param {any} reason 
   */
  static reject(reason) {
    return new MyPromise((reslove, reject) => {
      reject(reason)
    })
  }

  /**
   * 数组里 Promise 的状态全部 fulfilled，那么返回一个 Promise 数组，元素的值就是 Promise 成功的值，按传递 Promise 的顺序
   * 数组里 Promise 的状态有一个 rejected，那么就返回该失败 Promise 的原因
   * @param {MyPromise[]} promiseArr 
   */
  static all(promiseArr) {
    return new MyPromise((reslove, reject) => {
      const arr = []
      try {
        if (promiseArr.length === 0) {
          reslove(arr)
        }

        let i = 0
        let count = 0
        for (const item of promiseArr) {
          let j = i
          i++
          if (!isPromise(item)) {
            item = new MyPromise((reslove, reject) => {
              reslove(item)
            })
          }
          item.then(
            (data) => {
              count++
              arr[j] = data
              // 说明全部都是成功
              if (count === promiseArr.length) {
                reslove(arr)
              }
            },
            (reason) => {
              reject(reason)
            }
          )
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * 任务数组全部已决则成功，值为元素已决返回的值，没有失败
   * @param {MyPromise[]} promiseArr 
   */
  static allSettled(promiseArr) {
    const ps = []
    for (const p of promiseArr) {
      ps.push(MyPromise.reslove(p).then(
        (data) => ({
          state: FULFILLED,
          value: data
        }),
        (reason) => ({
          state: REJECTED,
          value: reason
        })
      ))
    }
    return MyPromise.all(ps)

    // return new MyPromise((reslove, reject) => {
    //   const arr = []
    //   let i = 0
    //   for (const item of promiseArr) {
    //     let j = i
    //     i++
    //     item.then((data) => {
    //       arr[j] = {
    //         state: FULFILLED,
    //         value: data
    //       }
    //       if (arr.length === promiseArr.length) {
    //         reslove(arr)
    //       }
    //     }, (reason) => {
    //       arr[j] = {
    //         state: REJECTED,
    //         value: reason
    //       }
    //       if (arr.length === promiseArr.length) {
    //         reslove(arr)
    //       }
    //     })
    //   }
    // })
  }

  /**
   * 返回一个 Promise，接收一个数组，数组里面是 Promise，谁快用谁
   */
  static race(promiseArr) {
    return new MyPromise((reslove, reject) => {
      for (const item of promiseArr) {
        MyPromise.reslove(item).then((data) => {
          reslove(data)
        }, (reason) => {
          reject(reason)
        })
      } 
    })
  }

  /**
   * 如果是元素里有成功的 Promise 就返回成功那个 Promise，全部失败返回一个数组，数组里是失败的原因
   * @param {MyPromise[]} promiseArr 
   */
  static any(promiseArr) {
    return new MyPromise((reslove, reject) => {
      const arr = []
      let i = 0
      let count = 0
      for (const item of promiseArr) {
        let j = i
        i++
        MyPromise.reslove(item).then((data) => {
          reslove(data)
        }, (reason) => {
          count++
          arr[j] = reason
          // 全部失败了
          if (promiseArr.length === count) {
            reject(arr)
          }
        })
      }
    })
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
// setTimeout(() => {
  // console.log(p1, 'p1')
// }, 1500)

const allP = MyPromise.any([
  new MyPromise((resolve, reject) => { setTimeout(() => {
    resolve(1)
  }, 1000); }), 
  new MyPromise((resolve, reject) => { reject(2) }), 
  new MyPromise((resolve, reject) => { reject(3) })
])
setTimeout(() => {
  console.log(allP)
  allP.then((res) => {
    console.log(res)
  })
}, 1000);

// p.then(function a1() {
//   console.log("a1")
// }, function a2() { })
// p.then(function b1() {
//   console.log("a2")
// }, function b2() {})
// console.log(p)
