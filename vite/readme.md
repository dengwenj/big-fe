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
- 插件化设计思想
  - 1、插件话底座
  - 2、插件协议（规范），数据协议、定义方式、生命周期钩子
- 自定义插件
  - config，用作配置相关的
  - transform，用作代码编译转换相关的
  - generateBundle，针对于产物的处理

### 我们有 rspack 这类构建工具，如果让你从零到一实现 vite 全生态，具体思路是什么？

### vite bundleless -- 少打包，浏览器 esm 支持
