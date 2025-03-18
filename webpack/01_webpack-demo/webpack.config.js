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