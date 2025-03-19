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

### Webpack5 的 loader、plugin 设计思想是怎样完成个性化打包构建需求的？
- webpack.config.js
```js
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
```

- loader 本质是个函数
```js
export default function tsFileLoader(source) {
  // 进行编译，转化一些工作 TODO
  const finallyRes = source.replace('朴睦', 'pumu')
  return finallyRes
}
```

- plugin 本质是个类
```js
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
```

### Webpack5 核心执行过程，主要包括以下几个阶段
1. 初始化阶段：
  - 创建 Webpack 实例：创建一个 Webpack 实例并加载用户的配置文件 webpack.config.js
  - 配置解析：解析配置文件，处理配置中的 entry（入口），output（输出），module（模块规则这里面写一些 loader），plugins 等配置项
2. 编译阶段：
  - 创建 Compiler 实例：在初始化阶段，Webpack 会基于配置文件创建 Compiler 实例，Compiler 是 Webpack 的核心对象，负责处理整个构建过程
  - 处理模块：Webpack 会根据 entry 配置项从入口文件开始，递归处理所有依赖的模块
  - 加载文件：通过 loaders 处理文件（例如：将 scss 转换成 css，将 jsx 转换成 js 等）
  - 模块解析：Webpack 会根据配置的 resolve 选项解析模块路径
3. 构建阶段：
  - 生成模块：所有模块都被打包成一个个的 chunk(代码块)，并最终生成输出文件
  - 执行插件钩子：Webpack 提供了大量的钩子供插件插入自己的操作，如 emit，done，afterEmit 等
4. 输出阶段：
  - 生成输出文件：根据 output 配置生成最终的打包文件
  - 执行插件钩子：如 done 在整个编译过程完成之后触发，可用来记录编译结果或执行一些收尾工作。
- 初始化 -> 编译 -> 构建 -> 输出
