### Webpack 和 Vite 总结、对比
1. 设计理念
  - Webpack：Webpack 是一个功能强大且高度可配置的模块打包工具，它将项目中的所有资源（如 JavaScript、CSS、图片等）都视为模块，通过各种 loader 和 plugin 对这些模块进行处理和打包，最终生成优化后的静态资源文件。其核心思想是**将项目中的所有资源都打包成一个或多个文件，以减少浏览器的请求次数，提高页面加载性能**。
  - Vite：**Vite 是一个基于原生 ES 模块导入的构建工具，它利用现代浏览器对 ES 模块的支持**，在开发环境中无需打包，直接以原生 ES 模块的方式提供文件，从而实现快速的冷启动和热更新，通过 esbuild 进行对浏览器不认识的模块进行编译处理。在生产环境中，Vite 会使用 Rollup 进行打包，以生成优化后的静态资源文件。其设计理念是追求极致的开发体验，通过减少不必要的打包过程，提高开发效率。
  - webpack 核心理念是：bundle，将项目中的所有资源都打包成一个或多个文件，以减少浏览器的请求次数，提高页面加载性能
  - vite 有个核心理念是：**bundleless**（esm）基于浏览器支持 esm 的特性，少打包，提高性能

2. 构建性能
  - 开发环境
    - Webpack：在启动开发服务器时，Webpack 需要对整个项目进行打包，这可能会导致较长的启动时间。尤其是在项目规模较大时，启动时间会显著增加。此外，Webpack 的热更新也需要重新打包受影响的模块，这可能会导致热更新速度较慢。
    - Vite：由于 Vite 在开发环境中无需打包，直接以原生 ES 模块的方式提供文件，因此启动速度非常快。即使在大型项目中，也能实现秒级启动。同时，Vite 的热更新只需要更新受影响的模块，无需重新打包整个项目，因此热更新速度极快，几乎可以实现即时更新。
  - 生产环境
    - Webpack：Webpack 在生产环境中经过多年的发展和优化，拥有丰富的插件生态系统，可以对代码进行深度优化，如**代码分割、压缩、Tree Shaking** 等，生成的打包文件性能较好。
    - Vite：Vite 在生产环境中使用 Rollup 进行打包，Rollup 本身也是一个优秀的打包工具，能够生成高质量的打包文件。同时，Vite 也提供了一些默认的优化配置，如代码分割、压缩等，生成的打包文件性能与 Webpack 相当。

3. 生态系统
  - Webpack 有大量的 loader 和 plugin 可供选择
  - Vite 自定义 plugin 可供选择

4. vite plugin
  - vite 插件本质上是一个对象，它定义了一个接口(规范)必须实现它的接口包含了多个钩子函数
  - vite 插件的执行顺序（多个插件）(先前往后)
  ```js
  plugins: [vue(), VitePluginEmojiReplacer(), VitePluginPort()],
  ```

5. webpack loader
  - Webpack Loader 的本质是一个函数，它是 Webpack 实现模块处理功能的核心机制，用于对不同类型的文件进行转换，使得 Webpack 能够处理除 JavaScript 之外的各种资源文件
  - Webpack Loader 具体执行时机是在**模块解析之后** **模块构建之前**
  - webpack 的 loader 的执行顺序（多个）
    - 在 Webpack 里，多个 loader 的执行顺序是从右到左、默认从上到下，可以用 enforce: 'pre' 来设置
    ```js
    // 从右到左、从上到下
    module.exports = {
      module: {
          rules: [
              {
                  test: /\.less$/, // 规则
                  use: ['style-loader', 'css-loader', 'less-loader']
                  // enforce: 'pre', // 先执行
              },
              {
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader'],
                  // enforce: 'post', // 最后执行
              }
          ]
      }
    };
    ```

6. webpack plugin
  - webpack plugin 本质是对象，它定义了一个接口(规范)必须实现它的接口，包含了多个钩子函数，这个特定接口主要围绕 apply 方法展开，插件通过该方法接入 Webpack 构建流程，并且会使用到 Webpack 提供的 compiler 和 compilation 对象上的钩子来实现具体功能。
  - webpack plugin 的执行顺序**从上往下**
  ```js
  export default {
    plugins: [
      new CustomPlugin({
        name: '朴睦',
        age: 25
      }),
      {
        apply(complier) {
          console.log(complier, 'webpack plugin 本质是对象')
        }
      }
    ],
  }
  ```

7. 性能优化
  - webpack optimization 配置
  ```js
  // 代码压缩 代码拆分，代码合并  
  // 优化相关的
  optimization: {
    // 压缩
    minimize: true,
    // chunk 拆分细节
    splitChunks: {
      chunks: 'all'
    }
  },
  ```
  - 代码拆分
   - 代码拆分几种方式：1、动态导入(自动切分)，2、设置多个入口点，3、optimization.splitChunks.chunks: 'all'
  - Tree Shaking 移除未使用的代码
  - 为静态资源添加内容哈希，便于缓存管理

8. vite
  - vite 核心优势：极速启动、HMR、ESM 原生支持。
  - 与 Webpack 对比：开发模式（ESM vs 打包）、构建工具（Rollup vs 自研）。
  - 原理：依赖预打包、按需编译、HMR 实现。
  - 配置：别名、代理、插件开发。
  - 实践：（CSS Modules、TypeScript、SSR vite内部就支持）、性能优化。
  - 记忆技巧：结合 Vite 的设计理念（“原生 ESM 优先”）理解其机制，对比 Webpack 的传统打包模式，突出 “轻量” 和 “高效” 的特点。

9. Webpack 本身仅能理解 JavaScript 和 JSON 文件，对于其他类型的文件，它需要借助 loader 来进行处理。loader 是一种转换器，能把不同类型的文件转换为 Webpack 可以处理的模块。
  - 自定义 loader 返回的值通常是一段可执行的 JavaScript 代码，用于执行副作用操作、注册全局变量或模块、动态加载其他资源等，这些代码会在打包后的 JavaScript 文件中被执行。
  ```js
  module.exports = function customLoader(source) {
    // 假设这里对 source 进行了处理，得到了处理结果
    const processedData = `Processed: ${source}`;
    return `export { data: '${processedData}' };`; // esm
    return `module.exports = { data: '${processedData}' };`; // commonjs
  };
  ```

10. 分包策略（通过多种分包策略可以有效减少包的体积，提高应用性能）
  - webpack，使用 optimization.splitChunks.cacheGroups 拆分到单独的文件中去，减少体积，拆分公共代码，SplitChunksPlugin 内置的插件
  ```js
  optimization: {
    // 对代码进行分割，将代码拆分成更小的块，从而实现按需加载，减少首屏加载时间，提高应用性能
    splitChunks: {
      maxAsyncRequests: 30, // 增加异步加载的最大请求数
      maxInitialRequests: 30, // 增加初始加载的最大请求数
      // 具体怎么拆分，拆分到单独的文件中去，减少体积，还有复用
      cacheGroups: {
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'vendors',
        //   priority: 10,
        //   // 对哪些类型的代码块应用当前缓存组规则进行指定。
        //   // 可以是 'initial'（只处理初始加载的代码块）、'async'（只处理异步加载的代码块）或者 'all'（处理所有代码块）。
        //   chunks: 'initial'
        // },
        // 公共的依赖指的是在多个模块或文件中被重复使用的代码或第三方库。这些依赖通常会被打包到单独的文件中，
        // 以便在多个页面或组件之间共享，从而减少重复代码，优化加载性能
        'ant-design-vue': {
          // 匹配 ant-design-vue 模块
          test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
          // 代码块名称
          name: 'ant-design-vue',
          // 对所有类型的块进行分割
          chunks: 'all',
          // priority: -10
        },
        'element-ui': {
          // 匹配 ant-design-vue 模块
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          // 代码块名称
          name: 'element-ui-test',
          // 对所有类型的块进行分割
          chunks: 'all',
        },
        // 业务组件的
        components: {
          test(module) {
            return module.resource && module.resource.includes('src/components')
          },
          name: 'components',
          chunks: 'all',
        },
      }
    }
  },
  ```
  - vite 使用 build.rollupOptions.manualChunks，Vite 使用 Rollup 进行打包。使用 Rollup 的 manualChunks 配置手动进行拆分
  ```js
   build: {
    rollupOptions: {
      // 排除 Ant Design Vue，不进行打包，使用 cdn 引入
      // external: ['ant-design-vue'],
      manualChunks(id) {
        if (id.includes('node_modules')) {
          // 拆分第三方依赖
          if (id.includes('ant-design-vue')) {
            return 'ant-design-vue';
          }
          return 'vendor'; // 其他依赖打包到 vendor，避免拆分过细 导致 HTTP 请求过多
          // // 按包名精细化拆分
          // const packageName = id.match(/node_modules\/(.+?)\//)?.[1]
          // return packageName ? `vendor/${packageName}` : 'vendor'
        }
        if (id.includes('src/views')) {
          return 'views'
        }
        if (id.includes('src/components')) {
          return 'components'
        }
      }
    }
  }
  ```

11. 生成压缩代码文件(gz、br)
  - 文件体积减少。浏览器请求的是压缩文件，使得 速度增快，资源耗费减少
  - 分包 + 响应给浏览器压缩文件，不是源文件。使得文件体积再次缩小，性能再次提升
  ```js
  // vite
  plugins: [
    viteCompression({
        // 开启 gzip 压缩
        algorithm: 'gzip',
        // 生成 .gz 文件
        ext: '.gz',
        // 仅对大于 1kb 的文件进行压缩
        threshold: 1024,
    }),
    viteCompression({
        // 开启 brotli 压缩
        algorithm: 'brotliCompress',
        // 生成 .br 文件
        ext: '.br',
        threshold: 1024,
    })
  ]

  // webpack
  plugins: [
    // gzip 压缩
    new CompressionPlugin({
      filename: '[path][base].gz', // 输出的文件名
      algorithm: 'gzip', // 使用 gzip 压缩
      test: /\.(js|css|html|svg)$/, // 匹配需要压缩的文件类型
      threshold: 10240, // 只压缩大于 10KB 的文件
      minRatio: 0.8, // 只有压缩率低于 0.8 的文件才会被压缩
    }),
    // Brotli 压缩
    new CompressionPlugin({
      filename: '[path][base].br', // 输出的文件名
      algorithm: 'brotliCompress', // 使用 Brotli 压缩
      test: /\.(js|css|html|svg)$/, // 匹配需要压缩的文件类型
      compressionOptions: {
        level: 11, // Brotli 压缩级别，范围是 0-11
      },
      threshold: 10240, // 只压缩大于 10KB 的文件
      minRatio: 0.8, // 只有压缩率低于 0.8 的文件才会被压缩
    }),
  ]
  ```