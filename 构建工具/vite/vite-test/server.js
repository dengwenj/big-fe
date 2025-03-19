const express = require('express')
const fs = require('fs')
const esbuild = require('esbuild')

const app = express()

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/*.css', (req, res) => {
  const path = req.path

  const file = fs.readFileSync(__dirname + path, 'utf-8')
  res.type('application/css')
  res.send(file)
})

app.get('/*.js', (req, res) => {
  const path = req.path

  const file = fs.readFileSync(__dirname + path, 'utf-8')
  res.type('application/javascript')
  res.send(file)
})

app.get('/*.ts', async (req, res) => {
  const path = req.path

  // 通过 esbuild 进行转换 编译（转译工作）
  const file = fs.readFileSync(__dirname + path, 'utf-8')
  const trasnformRes = await esbuild.transform(file, {
    // loader 参数用于告诉 esbuild 如何处理输入的文件内容
    loader: 'ts',
    // format 参数用于指定输出代码的模块格式 esm iife cjs
    format: 'esm',
    // target 参数用于指定输出代码所兼容的 JavaScript 版本
    target: 'es6'
  })
  // res.type('js')
  res.type('application/javascript')
  // 相当于拦截了，再给浏览器传递回 js 内容
  res.send(trasnformRes.code)
})

app.listen(3000, () => {
  console.log("服务器3000端口：" + "http://localhost:3000")
})
