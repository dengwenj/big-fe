### 构建优化
- 一些老项目，每次启动时都会耗费很长时间，原因是：Webpack 的项目，即便是在开发环境下，也是要先打包才能在浏览器看到效果。
```js
// 自定义 Markdown 文档插件
class ChunkInfoPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('ChunkInfoPlugin', (compilation) => {
      console.log(compilation.assets, 'compilation.assets')
    })
  }
}

module.exports = ChunkInfoPlugin
```