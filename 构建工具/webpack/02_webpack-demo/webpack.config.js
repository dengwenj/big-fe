import HtmlWebpackPlugin from 'html-webpack-plugin'
import CustomPlugin from './custom-plugin.js'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path, { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(path.resolve(__dirname, 'dist'), 'ww')
export default {
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    clean: true,
    path: path.resolve(__dirname, 'dist'),
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
        test: /\.css$/,
        // MiniCssExtractPlugin.loader 把css 放到单独的文件，默认 webpack 在 js 文件里引入 css，会把 css 放入 js 里面
        use: [MiniCssExtractPlugin.loader ,'css-loader']
      },
      {
        // 遇到了 .ts 后缀的文件，就会只执行定义的 loader
        test: /\.ts$/,
        // use 是数组的话 loader 是先从最后一个执行，然后依次往前
        use: [/* 自定义的 loader */ './tsfile-loader.js', 'ts-loader'],
        exclude: /node_modules/
      },
    ]
  },

  // plugin 本质是对象
  // 做一些增强功能
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CustomPlugin({
      name: '朴睦',
      age: 25
    }),
    {
      apply(complier) {
        // console.log(complier, 'webpack plugin 本质是对象')
      }
    },
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],

  resolve: {
    extensions: ['.ts', '.js']
  },
}