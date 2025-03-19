### node 的架构
- Native Modules：暴露给开发者使用的接口，是 js 的实现。path，fs，http
- Builtin Modules：中间层，可以让 node 获取一些更底层的操作
- libuv：一个高性能的，c编写的，异步非阻塞的 IO 库，实现事件循环的
- http-parser：处理网络报文
- openssl：处理加密算法
- zlib：文件压缩

### node 环境和 浏览器环境有什么区别
- 事件循环本质上是宿主环境(node、浏览器)来提供的，它们的事件循环也不一样
  - 浏览器：
    - 同步代码执行：事件循环开始时，先执行执行栈中的同步代码。
    - 微任务处理：同步代码执行完毕后，处理微任务队列，将队列中的所有微任务依次执行完。
    - requestAnimationFrame 回调执行：微任务处理完后，在 UI 渲染之前，执行 requestAnimationFrame 的回调函数。
    - UI 渲染：浏览器根据 DOM 的变化进行页面的渲染。
    - requestIdleCallback 回调尝试执行：UI 渲染完成后，如果当前帧还有剩余时间（即浏览器处于空闲状态），就会执行 requestIdleCallback 的回调函数。若当前帧没有空闲时间，回调函数会推迟到下一帧的空闲时段执行。
    - 宏任务执行：requestIdleCallback 执行完毕或者当前帧没有空闲时间跳过该步骤后，从宏任务队列中取出一个宏任务执行。

    - requestIdleCallback 会在当前帧的关键任务（同步代码、微任务、requestAnimationFrame 回调、UI 渲染）完成后，且浏览器有空闲时间时执行，它的目的是利用浏览器的空闲时段来执行低优先级的任务，避免影响关键任务的性能

- 因为宿主环境的不同，API 支持的也不一样
  - node：v8 + API -> fs, path，http
  - chrome：v8 + API -> DOM BOM
- node 一般是 commonjs 的规范，浏览器不支持

### node 事件循环机制
* v8 引擎解析 js 的代码，调用 node api
* libuv 库负责 Node API 执行，将不同的任务分为不同的线程，形成一个 event loop
```js
async function async1() {
  console.log("async1 started")
  await async2()
  console.log('async end')
}

async function async2() {
  console.log("async2")
}

console.log("script start")

setTimeout(() => {
  console.log("setTimeout0")
  setTimeout(() => {
    console.log("setTimeout1")
  }, 0)

  setImmediate(() => {
    console.log("setImmediate")
  })
}, 0)

async1()

process.nextTick(() => {
  console.log("nextTick")
})

new Promise((resolve) => {
  console.log("promise1")
  resolve()
  console.log("promise2")
}).then(() => {
  console.log("promise.then")
})

console.log("script end")
// script start
// async1 started
// async2
// promise1
// promise2
// script end
// nextTick
// async end
// promise.then
// setTimeout0
// setImmediate
// setTimeout1
```

### npm 包的依赖关系 / 为什么有 xxxDependencies？
- dependencies：直接项目依赖
  - 项目中打包后实际要用到的
  - vue，react
- devDependencies：开发依赖，不会被自动下载
  - webpack 
  - 打包是否会构建，取决于项目是否声明
  - 比如 在 devDependencies 中安装了 lodash，那么打包是也会把 lodash 打包进去

### npm ci 和 npm install 有什么区别
- npm ci 要求项目中必须存在 lock 文件
- npm ci 完全根据 package-lock.json 去安装依赖，可以保证整个团队开发都是用版本完全一致的依赖
- npm ci 不需要计算依赖树，所以速度更快
- npm ci 安装的时候会先删除 node_modules
- npm ci 无法单独安装某一个依赖包，只能一次安装整个项目的所有依赖包
- 如果 package.json 和 package-lock.json 文件产生冲突，npm ci 会直接报错，并不会更新 lock 文件
- npm ci 是非常稳定的安装方式，完全不会改变 package.json 和 lock 文件