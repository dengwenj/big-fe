// function transformObject(obj) {
//   const result = {};
//   // 遍历原始对象的每个键值对
//   for (const key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       const value = obj[key];
//       // 将键按点号分割成键路径数组
//       const keyPath = key.split('.');
//       let currentLevel = result;
//       // 遍历键路径数组
//       for (let i = 0; i < keyPath.length; i++) {
//         const currentKey = keyPath[i];
//         if (i === keyPath.length - 1) {
//           // 如果是最后一个键，直接赋值
//           currentLevel[currentKey] = value;
//         } else {
//           // 如果不是最后一个键，检查该键对应的对象是否存在
//           if (!currentLevel[currentKey]) {
//             // 若不存在，创建一个空对象
//             currentLevel[currentKey] = {};
//           }
//           // 移动到下一层对象
//           currentLevel = currentLevel[currentKey];
//         }
//       }
//     }
//   }
//   return result;
// }

// const obj = {
//   "a.b.c": 123,
//   "a.b.d": 124,
//   "d.a.c": 432
// };

// const transformedObj = transformObject(obj);
// console.log(transformedObj); // { a: { b: { c: 123, d: 124 } }, d: { a: { c: 432 } } }

// /**
//  * 两个顺序数组，合并为一个顺序数组。双指针法
//  */
// const arr1 = [1, 7, 8, 9]
// const arr2 = [3, 4, 6]
// function mergeArr(arr1, arr2) {
//   // 双指针
//   let i = 0
//   let j = 0
//   const arr = []

//   while (i < arr1.length && j < arr2.length) {
//     if (arr1[i] < arr2[j]) {
//       arr.push(arr1[i])
//       i++
//     } else {
//       arr.push(arr2[j])
//       j++
//     }
//   }

//   while (i < arr1.length) {
//     arr.push(arr1[i])
//     i++
//   }

//   while (j < arr2.length) {
//     arr.push(arr2[j])
//     j++
//   }

//   return arr
// }
// console.log(mergeArr(arr1, arr2));


// // 防抖
// function debounce(fn, time) {
//   let timer = null
//   return function(...args) {
//     if (timer) {
//       // 清除上一次的
//       clearTimeout(timer)
//     }
//     timer = setTimeout(() => {
//       fn.apply(this, args)
//     }, time)
//   }
// }

// const fn = debounce((num1, num2) => {
//   console.log(num1, num2)
// }, 100)
// // 调用这个函数，会触发回调函数
// fn(1, 2)

// setTimeout(() => {
//   fn()
// }, 140)

// setTimeout(() => {
//   fn(3, 4)
// }, 30)

// // 多任务同时执行，一个一个进 有个任务的最大值，当某个任务执行完后，继续执行下一个任务
// class Task {
//   constructor(maxNum, time) {
//     // 保存同时最多能执行多个任务
//     this.maxNum = maxNum
//     // 任务要执行多久
//     this.time = time
//     // 存放任务的队列
//     this.tasks = []
//     // 执行任务的队列
//     this.runTasks = []
//   }

//   // time: 任务执行的时间是多久
//   run() {
//     while (this.maxNum > this.runTasks.length) {
//       const fn = this.tasks.shift()
//       this.runTasks.push(fn)
//       setTimeout(() => {
//         fn.call(this)
//         this.runTasks = this.runTasks.filter((item) => item !== fn)

//         if (this.tasks.length) {
//           this.run()
//         }
//       }, this.time)
//     }
//   }

//   addTask(fn) {
//     this.tasks.push(fn)
//   }
// }

// const t = new Task(3, 1000)

// t.addTask(function t1() {
//   console.log("任务1")
// })

// t.addTask(function t2() {
//   console.log("任务2");
// })

// t.addTask(function t3() {
//   console.log("任务3")
// })

// t.addTask(function t4() {
//   console.log("任务4")
// })

// t.addTask(function t6() {
//   console.log("任务6")
// })


// t.addTask(function t5() {
//   console.log("任务5")
// })

// t.run()

// const person = {
//   name: '朴睦',
//   get cName() {
//     return this.name + "25"
//   }
// }

// const p = new Proxy(person, {
//   get(target, key, receiver) {
//     return Reflect.get(target, key, receiver)
//     // return target[key] // person.name 不会触发，因为 target 没有被代理，所以不会触发，要用代理对象去取才会走getter
//   },
//   set(target, key, val, receiver) {
//     return Reflect.set(target, key, val, receiver)
//   }
// })


// 最长递增子序列
// 先求出最长递增子序列的个数有多少个
// 2 3 1 5 6 8 7 9 4 2
// 2（2的前一个是 null）
// 2 3（3的前一个是2）
// 1 3（1的前一个是null）
// 1 3 5（5的前一个是3）
// 1 3 5 6（6的前一个是5）
// 1 3 5 6 8（8的前一个是6）
// 1 3 5 6 7（7的前一个是6）
// 1 3 5 6 7 9（9的前一个是7）
// 1 3 4 6 7 9（4的前一个是3）
// 1 2 4 6 7 9（2的前一个是1） // 最长递增子序列的个数就是6

// 找最有潜力的
const arr = [2, 3, 1, 5, 6, 8, 7, 9, 4, 2]
const storage = [] // 先求出最长递增子序列的个数有多少个
// 记录前一个的值 [[9, 7], [7, 6], [6, 5]]
const mark = []
// 最终结果
const res = []
for (let i = 0; i < arr.length; i++) {
  const item = arr[i]

  if (storage.length === 0) {
    storage.push(item)
    mark.push([null, item])
  } else {
    // item 是否大于存储最后一个
    if (item >= storage[storage.length - 1]) {
      mark.push([storage[storage.length - 1], item])
      storage.push(item)
    } else {
      // 找出最有潜力的
      let index = -1
      for (let j = 0; j < storage.length; j++) {
        const itex = storage[j]
        if (itex > item) {
          index = j
          break
        }
      }
      const preVal = storage[index - 1] || null
      storage[index] = item
      mark.push([preVal, item])
    }
  }
}
let max = -1
let maxIndex = -1
for (let i = 0; i < mark.length; i++) {
  const [pre, val] = mark[i];
  if (max < val) {
    max = val
    maxIndex = i
  }
}
const a = mark.slice(0, maxIndex + 1)
let p = -1
for (let i = a.length - 1; i >= 0; i--) {
  const [pre, val] = a[i]
  // console.log(pre, 'pre')
  if (res.length === 0) {
    res.push(val)
    p = pre
  } else {
    if (val === p) {
      res.push(val)
      p = pre
    }
  }
}
res.reverse()
console.log('最终结果：', res)
