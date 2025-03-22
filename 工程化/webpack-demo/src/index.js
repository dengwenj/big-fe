/**
 * 我们写的代码是给 webpack 看的，不是给运行时环境看。所以想怎么写就怎么写，用自定义 loader、plugin 去做代码转换，代码增强就行
 * 运行时环境看的是：webpack 最终会打包好的文件
 */

import data from './demo.txt'

console.log(data) // { data: console.log(1) } 具体看自定义的 loader, custom-loader2.js

const sum = (a, b) => {
  return a + b
}

console.log(sum)
