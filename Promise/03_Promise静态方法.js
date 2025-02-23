/**
 * 可以对多任务的场景进行处理
 */

/**
 * 直接返回一个完成状态的任务
 */
Promise.resolve(1)

/**
 * 直接返回一个拒绝状态的任务
 */
Promise.reject("失败")

/**
 * 返回一个任务，任务数组全部成功则成功，任何一个失败则失败
 */
Promise.all([Promise.resolve(1), Promise.reject(2), Promise.resolve(3)])

/**
 * 返回一个任务，任务数组任一成功则成功，任务全部失败则失败
 */
Promise.any([Promise.resolve(1), Promise.reject(2), Promise.resolve(3)])

/**
 * 返回一个任务，任务数组全部已决则成功，该任务不会失败
 */
Promise.allSettled([Promise.resolve(1), Promise.reject(2), Promise.resolve(3)])

/**
 * 返回一个任务，任务数组任一已决则已决，状态和其一致
 */
Promise.race([Promise.resolve(1), Promise.reject(2), Promise.resolve(3)])