### 详细说说 Vite5 工程化配置细节，常见配置和优化手段
- 本地开发服务
```js
server: {
  port: 3000,
  // 代理，请求转发
  proxy: {
    // 本地开发会存在跨域问题
    '/api': {
      target: 'https://cnodejs.org/api/v1', // 请求转发的地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api
    }
  }
}
```
- 生产构建配置
```js
build: {
  outDir: 'build', // 输出目录
  // 超出大小的警告
  chunkSizeWarningLimit: 200,
  // 资源目录
  assetsDir: 'assets',
  // 一般情况下都不能直接将 sourcemap 部署到生产环境，因为会暴露源码
  // sourcemap 是什么？如果不能上传到生产环境的话，怎么定位线上报错问题
  // sourcemap 可以定位到源码。用性能与异常监控平台，会托管 sourcemap 文件，通过 sourcemap 文件定位到源码
  sourcemap: true,
},
```
- 本地环境变量
- 别名设置
```js
resolve: {
  alias: {
    "@": '/src'
  }
}
```
- 优化配置
  - 代码压缩，有没有压缩插件
  - 分 chunk
    - 自动
    - 手动

### 了解过微内核设计思想吗？vite5 的插件化设计思想是怎样完成个性化打包构建需求的？
- 插件本质就是一个函数
- 插件化设计思想
  - 1、插件话底座
  - 2、插件协议（规范），数据协议、定义方式、生命周期钩子
- 自定义插件
  - config，用作配置相关的
  - transform，用作代码编译转换相关的
  - generateBundle，针对于产物的处理

### 我们有 rspack 这类构建工具，如果让你从零到一实现 vite 全生态，具体思路是什么？
- Vite 是一个构建工具，它在开发和生产环境中的行为有所不同，在开发环境下，它确实是在运行访问时才去做一系列事情，而在生产环境中则是提前构建打包。

#### 概述 Vite 打包构成
1. 初始化，vite.config.ts
2. 解析入口，两种解析方式
  1. 应用构建，html script
  2. 子包、构建产物，build
3. 插件底座初始化，插件生命周期调度
4. 优化处理
5. 拆分代码
6. 输出代码
7. 资源优化

#### 开发环境
- 在开发环境中，Vite 采用了按需编译的方式，也就是在运行访问时才去做一系列事情，具体流程如下：
  - 启动开发服务器：当你运行 vite 命令启动开发服务器时，Vite 会快速启动一个 HTTP 服务器，并且不会对项目中的所有文件进行预编译。
  - 拦截请求：当你在浏览器中访问项目页面时，浏览器会向 Vite 开发服务器发送请求。Vite 服务器会拦截这些请求。
  - 按需编译：对于请求的文件，Vite 会根据文件类型进行相应的处理。例如，对于 JavaScript 文件，Vite 会将 ES 模块语法转换为浏览器可以理解的格式；对于 CSS 文件，Vite 会进行处理并注入到页面中。这个过程是按需进行的，即只有当浏览器请求某个文件时，Vite 才会对其进行编译和处理。

#### 生产环境
- 在生产环境中，Vite 会进行预构建打包，而不是按需处理。具体步骤如下：
  - 静态分析：Vite 会对项目中的所有文件进行静态分析，确定它们之间的依赖关系。
  - 打包和优化：Vite 会将项目中的所有文件打包成一个或多个静态文件，并进行代码压缩、Tree Shaking 等优化操作，以减小文件体积，提高项目的加载速度。
  - 输出文件：最后，Vite 会将打包和优化后的文件输出到指定的目录中，你可以将这些文件部署到生产服务器上。

### vite bundleless -- 少打包，浏览器 esm 支持

### 对 Vite 的理解，什么是 bundleless ？
- 回答 bundleless 之前，必须要有模块化的知识
  - commonjs
  - amd
  - cmd
  - esm（es module）
- 正是 esm 的浏览器支持，才有 bundleless 方案

### 在 Vite 中，Bundleless 构建主要基于以下几点：
- ES 模块支持：现代浏览器和 Node.js 都支持 ES 模块（ES Modules），这使得可以直接在浏览器或 Node.js 中引入和使用独立的模块文件，而不需要将它们打包在一起。
- 按需加载：在 Bundleless 模式下，浏览器会根据页面的实际需求按需加载所需的模块文件，而不是一次性加载所有的代码。
- esm 的支持，成就了 vite。有了 esm，就出现了 bundleless 的概念，因为 improt 浏览器会执行，不用再去打包在一起

- bundle 打包，比如 webpack 需要通过模块化规范支持，依赖分析完之后构建依赖图 depGraph
- bundleless，提倡少打包、不打包。js可以不打包，但是 ts、tsx、jsx、vue 这些是浏览器不支持的，import './1.css' 也不支持，所以这些事需要打包的

### 产物构建机制
- 产物的构建从来不是依赖于打包工具，而是依赖于编译工具
- webpack 里面，要编译 js，比如 es6 变成 es5，用的是 babel 编译

### 打包
- 是将多个文件（如 JavaScript、CSS、图片等）合并成一个或少数几个文件的过程。它会分析文件之间的依赖关系，按照一定的规则将这些文件整合在一起，形成一个或多个最终的资源包。

### 编译
- 是将一种编程语言编写的代码转换为另一种编程语言或同一语言的不同版本代码的过程。通常是将高级语言代码（如 TypeScript、Sass）转换为计算机能够直接执行或浏览器能够理解的低级语言代码（如 JavaScript、CSS）。

### Vite 开发环境（不用打包，是发请求的形式，运行时编译的）
- js 不用打包直出，代码资源：ts、tsx、jsx、vue，样式资源：css，字体：woff2 这些是需要打包的。先编译成浏览器能够认识的再打包(打包：把这些文件合到其他文件去)
  - 用 esbuild 来构建编译 ts、tsx、jsx
  - postcss -> css
  - 需要针对需要打包的资源，做转换处理
  - vite 的插件 **vite-plugin-xxx** 来转换内容，vite-plugin-vue，vite-plugin-react
  - 优化
    - 已经编译的内容缓存
    - 增量编译
    - HMR

### Vite 生产环境
- 用 rollup 来打包
- 优化
  - 构建工具来处理，tree-shaking、chunk

### 为什么 Vite 的开发和生产，开发用 esbuild，打包生产用 rollup 呢？
- 开发环境使用 esbuild
1. 速度极快
esbuild 是用 Go 语言编写的，充分利用了 Go 语言的高性能和并行计算能力。在开发环境中，每次修改代码后都需要快速重新构建并更新页面，esbuild 的编译速度比传统的 JavaScript 打包工具（如 Rollup、Webpack）快很多倍。例如，对于大型项目，esbuild 可以在瞬间完成代码的编译和转换，大大缩短了开发者的等待时间，提高了开发效率。
2. 即时反馈
开发过程中，开发者需要频繁地修改代码并查看效果。esbuild 能够快速处理代码变化，实现高效的热更新（HMR）。它可以在不重新加载整个页面的情况下，精确地更新受影响的模块，让开发者能够立即看到代码修改后的效果。
3. 支持多种文件类型
esbuild 可以处理多种文件类型，包括 JavaScript、TypeScript、JSX、CSS 等。在开发环境中，它可以对这些文件进行快速编译和转换，无需开发者手动配置复杂的加载器和插件。

- 生产环境使用 Rollup
1. 成熟的模块处理能力
Rollup 是一个专注于 ES 模块的打包工具，它对 ES 模块的处理非常成熟。在生产环境中，项目通常会使用 ES 模块来组织代码，Rollup 能够更好地分析模块之间的依赖关系，将代码进行有效的打包和优化。它可以通过 Tree - Shaking 技术去除未使用的代码，减小打包文件的体积，提高应用的加载速度。
2. 丰富的插件生态系统
Rollup 拥有丰富的插件生态系统，开发者可以根据项目的需求选择合适的插件来实现各种功能，如代码压缩、图片优化、CSS 处理等。这些插件可以帮助开发者在生产环境中对代码进行全面的优化和处理，确保应用的性能和稳定性。
3. 生产环境优化
Rollup 在生产环境的优化方面有很多成熟的策略，例如代码分割、资源合并等。它可以将代码分割成多个较小的文件，实现按需加载，减少首屏加载时间。同时，Rollup 还可以对资源进行合并和优化，提高应用的整体性能。

### Vite 打包
- 默认情况下，build.modulePreload 为 true，Vite 会利用浏览器的模块预加载功能，以 ES 模块（ES6+ 的 import 和 export 语法）的形式进行打包。这样可以让浏览器更好地并行加载模块，提高页面加载性能。
- 如果将 build.target 设置为较低的版本，如 'es5'，Vite 会尝试将代码转换为目标版本兼容的语法。由于 ES5 不支持 import 和 export 语法，Vite 可能会使用其他模块化方案，如 CommonJS（require 和 module.exports）来替代

### Vite 构建过程
#### Vite 本地开发服务
1. 项目初始化：读取并解析 vite.config.js 配置文件
2. 启动开发服务器：基于 express 启动 http 服务器
3. ESM 支持：利用浏览器的原生 ESM 进行模块加载
4. 按需编译： 使用 esbuild 实时编译请求的模块
5. 热模块替换(HMR)：通过 WebSocket 实现模块的局部更新
6. Source Maps：自动生成 Source Maps，便于调试

#### Vite 生产构建
1. 项目初始化：读取并解析 vite.config.js 配置文件
2. 入口解析：使用 Rollup 构建模块依赖图
3. 插件处理：通过插件系统进行代码转换、压缩和资源处理
4. Tree Shaking：移除未使用的代码
5. 代码拆分：将代码拆分成多个模块
6. 生成输出：打包生成最终的输出文件
7. 资源优化：优化 css 和静态资源
8. 缓存策略：为静态资源添加内容哈希，便于缓存管理

### vite 最核心的一个理念是 bundleless