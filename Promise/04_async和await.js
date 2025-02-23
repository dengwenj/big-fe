/**
 * async 关键字用于修饰函数，被它修饰的函数，一定返回 Promise
 * await 关键字表示等待某个 Promise 完成，它必须用于 async 函数中
 * await 也可以等待其他数据：await 1
 * 如果需要针对失败的任务进行处理，可以使用 try-catch 语法
 */

async function foo() {
  // 会进入 catch 里面
  throw new Error("失败")
}
(async () => {
  try {
    const data = await foo()
    console.log(data)
  } catch (error) {
    console.log('error: ' + error.message)
  }
})()

async function bar() {
  return 1
}
(async () => {
  // bar().then((res) => { console.log(res) }) 等价于下面的
  const res = await bar()
  console.log(res)
})()

function sendMsg(name) {
  return new Promise((resolve, reject) => {
    console.log(`正在向女神${name}发送消息：做我女朋友吧`);
    setTimeout(() => {
      // 0 - 1,10%的几率
      if (Math.random() <= 0.1) {
        resolve(name + "回复：我同意啦")
      } else {
        reject(name + "回复：你是个好人")
      }
    }, 1000)
  })
}
const arr = ["韩梅梅", "李妹妹", "黄妹妹", "王妹妹", "郝妹妹", "金妹妹", "邓妹妹", "郑妹妹"]

;(async () => {
  let isSuccess = false
  for (const name of arr) {
    try {
      const data = await sendMsg(name)
      console.log(data)
      isSuccess = true
      break
    } catch (error) {
      console.log(error)
    }
  }
  if (!isSuccess) {
    console.log("孤独终老")
  }
})()