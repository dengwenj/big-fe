## 打包构建的本质：从一堆杂乱的资源中间去甄选去构建依赖图，通过 构建 编译 打包 整个环节，**输出一个标准化的产出**

### Webpack5 工程化配置细节，常见配置和优化手段
- 和 vite 对比：
  - vite 有个核心理念是：bundleless（esm）
  - webpack bundle 工具
- 模块化支持
- 构建过程
- 编译环节（编译时）
- 优化输出

- 架构层
  - 钩子函数（hooks），执行时机（执行时函数预埋好），tapable(事件处理的)
    - tapable 的主要功能：
      - tap：用于向钩子注册事件处理函数
      - call：用于触发钩子执行
      - promise：用于返回一个 Promise 对象，支持异步钩子
  - 全流程

- 编译、转化、优化、压缩，被抽象成 -> loader、plugin

#### 初始化
- webpack cli，
- webpack
- webpack 使用的两种途径
  - cli 使用
  - node api
```js
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  // 入口
  // entry: '', 单入口
  // entry: [], 多入口
  entry: {
    // 多入口，模块拆分，性能优化
    main: './src/index.js',
    main2: './src/index2.js'
  },
  output: {
    filename: '[name].[contenthash].js',
    clean: true,
    environment: {
      arrowFunction: false,
    }
  },
  // 编译、转化、优化、压缩，被抽象成 -> loader、plugin

  // loader 用来去编译那些资源(js ...)，处理资源
  // plugin 是增强输出的（比如说编译之后都是一些零散的东西，用 plugin 来让它们做聚合做拆分...）

  // 编译、转化、优化、压缩 -> loader
  // 功能增强 -> plugin
  // loader 本质是函数，plugin 本质是类
  module: {
    rules: [
      {
        test: '/\.js$/',
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],

  // 优化相关的
  optimization: {
    // 压缩
    minimize: true,
    // chunk 拆分细节
    splitChunks: {
      chunks: 'all'
    }
  },

  // 代码拆分几种方式：1、动态导入(自动切分)，2、设置多个入口点

  // 打包模式
  // mode: 'development',
  mode: 'producation'
}
```
