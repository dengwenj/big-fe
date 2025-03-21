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

### js 垃圾回收，是如何实现的
- 引用计数
  - a -> 有多少引用了它
  - 弊端： a 引用了 b，b 引用了 a
- 标记清除
  - 从 GC Root 根节点上，一层一层往下走，能索引到的，就是不回收的

### process
- process.argv 可以拿到一些参数，node index.js pumu hmm 可以拿到 pumu 和 hmm 这两个参数
- process.cwd() 可以拿到命令行运行的地址

### 开启子进程
```js
// master
const childProcess = require('child_process')

// 开启子进程
const processMaster = childProcess.fork(__dirname + "/child.js")

// 向子进程发送消息
processMaster.send("你好")

// 父进程中接收子进程的消息
processMaster.on('message', (data) => {
  console.log(data)
})

// child
process.on('message', (data) => {
  // 父进程给子进程发送的消息
  console.log(data)
})
```
- 使用子进程开启一个 web 服务
```js
const childProcess = require('child_process')
const path = require('path')

const cp = childProcess.spawn('node', ['childProcess.js', 'pumu', 'ww'], {
  cwd: path.resolve(__dirname)
})

cp.stdout.on('data', (data) => {
  console.log(`子进程标准输出：\n${data.toString()}`);
});

// 监听子进程退出事件
cp.on('close', (code) => {
  console.log(`spawn 创建的子进程已退出，退出码: ${code}`);
});


// childProcess.js 文件
const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  res.end("hello world")
})

server.listen(3002, () => {
  console.log("子进程里服务器启动成功")
  // console.log(process.argv)
})

setTimeout(() => {
  process.exit()
}, 3000);
```

### 手写 require 函数
```js
/**
 * myRequire 这函数里在传递该函数，不会形成无效递归，因为某个文件没有调用 require 就退出递归条件了
 */
const { resolve } = require('path');
const fs = require('fs');

// 用于存储已加载模块的缓存
const moduleCache = {};

function myRequire(filename) {
  // 检查模块是否已经在缓存中，只加载一次
  if (moduleCache[filename]) {
    return moduleCache[filename].exports;
  }

  const fileContent = fs.readFileSync(resolve(__dirname, filename), 'utf-8');
  const warpped = `(function(require, module, exports){
    ${fileContent}
  })(require, module, exports)`;

  const module = {
    exports: {}
  };

  // 将模块添加到缓存中
  moduleCache[filename] = module.exports;

  const fn = new Function('require', 'module', 'exports', warpped);
  fn(myRequire, module, module.exports);

  return module.exports;
}
myRequire('./childProcess.js')
```

### readfile 和 createReadStream 有什么区别
- readfile：异步的文件读取函数，读取的内容是一次性读取，存储在内存中，再传给用户
- createReadStream： 可读流，逐块的读取文件，而不是一次性全部放在内存

### 发布订阅
```js
class EventEmitter {
  constructor() {
    // key 存的是事件名，val 存的是数组 元素是回调函数
    this.event = {}
  }

  on(type, cb) {
    if (this.event[type]) {
      this.event[type].push(cb)
    } else {
      this.event[type] = [cb]
    }
  }

  emit(type, ...args) {
    if (!this.event[type]) {
      return
    }

    for (const cb of this.event[type]) {
      cb.call(this, ...args)
    }
  }

  once(type, cb) {
    const wrap = (...args) => {
      cb.call(this, ...args)
      this.off(type, wrap)
    }
    this.on(type, wrap)
  }

  off(type, cb) {
    if (!this.event[type]) {
      return
    }
    // 删除掉 cb
    this.event[type] = this.event[type].filter((item) => item !== cb)

    if (this.event[type].length === 0) {
      delete this.event[type]
    }
  }
}

const e = new EventEmitter()

const first = (a, b, c) => {
  console.log('第一个的：' + a, b, c)
}
e.on('pumu', first)

e.on('pumu', (a, b, c) => {
  console.log('第二个的：' + a, b, c)
})

e.once('pumu', (a, b, c) => {
  console.log('once：' + a, b, c)
})

e.emit('pumu', 'a', 'b', 'c')
e.off('pumu', first)
e.emit('pumu', 'd', 'w', 'j')
```