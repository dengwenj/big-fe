/**
 * 使用回调方法解决异步场景
 */
function sendMessage(name, resolve, reject) {
  console.log(`正在向女神${name}发送消息：做我女朋友吧`);
  setTimeout(() => {
    // 0 - 1,10%的几率
    if (Math.random() <= 0.1) {
      resolve(name + "回复：我同意啦")
    } else {
      reject(name + "回复：你是个好人")
    }
  }, 1000)
}

// const arr = ["韩梅梅", "李妹妹", "黄妹妹", "王妹妹", "郝妹妹", "金妹妹", "邓妹妹", "郑妹妹"]
// let i = 0
// sendMessage(arr[i], (res) => {
//   console.log("成功: " + res)
// }, (res) => {
//   console.log("失败: " + res)
//   i++
//   sendMessage(arr[i], (res) => {
//     console.log("成功: " + res)
//   }, (res) => {
//     i++
//     console.log("失败: " + res)
//     // ... 
//   })
// })

/**
 * Promise 是一套专门处理异步场景的规范，它能有效的避免回调地狱的产生，使异步代码更加清晰、简洁、统一
 * Promise A+ 规范：
 * 1、所有的异步场景，都可以看作是一个异步任务，每个异步任务，在 JS 中应该表现为一个对象，该对象称之为 Promise 对象，也叫做任务对象
 * 2、每个任务对象，都应该有两个阶段（未决阶段、已决阶段）、三个状态（pending、fulfilled、rejected）
 * 3、挂起 -> 完成，称之为 resolve；挂起 -> 失败，称之为 reject。任务完成时，可能有一个相关数据，任务失败时，可能有一个失败原因
 * 4、可以针对任务进行后续处理，针对完成状态的后续处理称之为 onFulfilled，针对失败的后续处理称之为 onRejected
 */
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
// sendMsg("小红").then((res) => {
//   console.log("成功 " + res)
// }, (res) => {
//   console.log("失败 " + res)
// })

// 链式调用
sendMsg("小红")
  .catch((res) => {
    console.log(res)
    return sendMsg("小明")
  })
  .catch((res) => {
    console.log(res)
    return sendMsg("小黑")
  })
  .catch((res) => {
    console.log(res)
    return sendMsg("小王")
  })
  .then((res) => {
    console.log(res)
  }, (res) => {
    console.log(res)
    console.log("最后一个也没有呜呜呜")
  })