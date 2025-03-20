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
  moduleCache[filename] = module;

  const fn = new Function('require', 'module', 'exports', warpped);
  fn(myRequire, module, module.exports);

  return module.exports;
}
myRequire('./childProcess.js')
