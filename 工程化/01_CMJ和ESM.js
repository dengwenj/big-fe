/**
 * CommonJS
 * - 社区实现
 * - 使用函数实现
 * - 仅 node 环境支持
 * - 动态依赖(需要代码运行后才能确定依赖)
 * - 动态依赖时同步执行的
 * - 每个模块都在一个函数里面执行
 * 
 * ESModule
 * - 官方标准
 * - 使用新语法实现
 * - 所有环境都支持
 * - 同时支持静态依赖和动态依赖，静态依赖在代码运行前就要确定依赖关系
 * - 动态依赖是异步的
 * - 符号绑定
 * 
 * commonjs 和 esmodule 的区别是什么 就是上面👆🏻
 */

// const m = require('./01_CMJ和ESM')

// require 函数的伪代码
function require(path) {
  if (该模块有缓存吗) {
    return 缓存结果;
  }

  function _run(exports, require, module, __filename, __dirname) {
    // 模块代码会放到这里
    // 比如：a.js、b.js
  }

  var module = {
    exports: {}
  }

  _run.call(
    module.exports,
    module.exports,
    require,
    module,
    模块路径,
    模块所在目录
  )

  // 把 module.exports 加入到缓存
  return module.exports
}

import('./01_a.js').then((res) => {
  console.log(res)
})
