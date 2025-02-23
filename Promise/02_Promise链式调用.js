/**
 * then 方法必定会返回一个新的 Promise，可以理解为后续处理也是一个任务
 * 新任务的状态取决于前面一个Promise的后续处理：
 * 1、若没有相关的后续处理，新任务的状态和前任务一致，数据为前任务的数据
 * 2、若有后续处理但还未执行，新任务挂起
 * 3、若后续处理执行了，则根据后续处理的情况确定新任务的状态
 *  - 后续处理执行无错，新任务的状态为完成，数据为后续处理的返回值
 *  - 后续处理执行有错，新任务的状态为失败，数据为异常对象
 *  - 后续执行后返回的是一个任务对象，新任务的状态和数据与该任务对象一致
 */
// const pro1 = new Promise((reslove, reject) => {
//   setTimeout(() => {
//     reslove(1)
//   }, 1000);
// })
// const pro2 = pro1.then((data) => {
//   console.log(data);
//   return data + 1
// })
// const pro3 = pro2.then((data) => {
//   console.log(data);
// })
// console.log(pro1, pro2, pro3)
// setTimeout(() => {
//   console.log(pro1, pro2, pro3)
// }, 2000);
// Promise {<pending> } Promise {<pending> } Promise {<pending> }
// 1
// 2
// Promise {1} Promise {2} Promise {undefined}

// new Promise((resolve, reject) => {
//   resolve(1)
// }).then((res) => {
//   console.log(res)
//   return 2
// }).catch((err) => {
//   return 3
// }).then((res) => {
//   console.log(res);
// })
// 1
// 2

new Promise((reslove, reject) => {
  throw new Error(1)
}).then((res) => {
  console.log(res)
  return new Error('2')
}).catch((err) => {
  throw err
  return 3
}).then((res) => {
  console.log("res: " + res)
}).catch((res) => {
  console.log("res: " + res)
})
// res: Error: 1
