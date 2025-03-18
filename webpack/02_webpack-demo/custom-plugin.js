import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class CustomPlugin {
  name = undefined

  constructor(person) {
    this.name = person.name
  }

  apply(compiler) {
    // assetEmitted 比 afterEmit 先执行
    compiler.hooks.assetEmitted.tapAsync('MyPlugin', (file, { content, ...rest }, callback) => {
      console.log(typeof file, file, '你好');
      // 如果在 compiler.hooks.afterEmit 钩子中不执行 callback 函数，Webpack 的构建流程会被阻塞，后续的钩子也不会继续执行。
      console.log("assetEmitted...")
      callback();
    });

    compiler.hooks.afterEmit.tapAsync('插件名称', (compilation, callback) => {
      const data = []
      data.push(this.name)
      for (const key in compilation.assets) {
        data.push(compilation.assets[key]._size)
      }
      const output = __dirname + "/dist"
      fs.writeFileSync(output + '/readme.md', data.join(','))
      // 如果在 compiler.hooks.afterEmit 钩子中不执行 callback 函数，Webpack 的构建流程会被阻塞，后续的钩子也不会继续执行。
      console.log("afterEmit...")
      callback()
    })
  }
}

// 另一种异步处理的方式是使用 tapPromise，它要求回调函数返回一个 Promise。
// 当 Promise 被解决（resolved）时，Webpack 会认为插件逻辑执行完毕
// const fs = require('fs');
// const util = require('util');

// const writeFile = util.promisify(fs.writeFile);

// class CustomPlugin {
//   constructor(person) {
//     console.log(person);
//   }

//   apply(compiler) {
//     compiler.hooks.afterEmit.tapPromise('插件名称', (compilation) => {
//       const data = [];
//       for (const key in compilation.assets) {
//         data.push(compilation.assets[key]._size);
//       }
//       const output = __dirname + "/dist";
//       return writeFile(output + '/readme.md', data.join(','))
//         .then(() => {
//           console.log('文件写入成功');
//         })
//         .catch((err) => {
//           console.error('写入文件时出错:', err);
//         });
//     });
//   }
// }

// module.exports = CustomPlugin;