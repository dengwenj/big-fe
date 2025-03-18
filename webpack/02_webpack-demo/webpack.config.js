import HtmlWebpackPlugin from 'html-webpack-plugin'
import CustomPlugin from './custom-plugin.js'

export default {
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    clean: true,
  },
  // 编译、转化、优化、压缩，被抽象成 -> loader、plugin

  // loader 用来去编译那些资源(js ...)，处理资源
  // plugin 是增强输出的（比如说编译之后都是一些零散的东西，用 plugin 来让它们做聚合做拆分...）

  // 编译、转化、优化、压缩 -> loader
  // 功能增强 -> plugin
  // loader 本质是函数
  module: {
    // loader 可以拿到代码字符串，做一些代码编译转化功能
    rules: [
      {
        // 遇到了 .ts 后缀的文件，就会只执行定义的 loader
        test: /\.ts$/,
        // use 是数组的话 loader 是先从最后一个执行，然后依次往前
        use: [/* 自定义的 loader */ './tsfile-loader.js', 'ts-loader'],
        exclude: /node_modules/
      },
    ]
  },

  // plugin 本质是类
  // 做一些增强功能
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CustomPlugin({
      name: '朴睦',
      age: 25
    })
  ],

  resolve: {
    extensions: ['.ts', '.js']
  },
}