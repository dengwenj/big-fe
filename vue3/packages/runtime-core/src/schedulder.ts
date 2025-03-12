
// 缓存当前要执行的队列
const queue = []
let isFlushing = false
const resolvePromise = Promise.resolve()

/**
 * 异步更新组件，使用 Promise，当同步任务全部执行完后再来执行异步任务
 * 同一个组件中更新多个状态 job 是同一个
 * @param job 调用 job 会执行 effect.run
 */
export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
  }

  if (!isFlushing) {
    isFlushing = true

    resolvePromise.then(() => {
      isFlushing = false

      // 先拷贝下，原因是：如果正在执行遍历，又同时新增了(14行)，就会导致错误
      const copyQueue = queue.slice(0)
      // 清空队列
      queue.length = 0
      for (const job of copyQueue) {
        job()
      }
      copyQueue.length = 0
    })
  }
}
