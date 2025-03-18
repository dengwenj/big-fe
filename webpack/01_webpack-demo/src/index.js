// 为什么需要 babel、babel-loader、swc、esbuild、TypeScript、ts-loader 等工具？
// 它们是来做编译的

import("./sum.js").then((res) => {
  console.log('第一个入口点里动态导入：', res)
})

const fn = () => {
  console.log("第一个入口点")
}
fn()
