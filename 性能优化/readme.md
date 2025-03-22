### 首屏加载优化

### 是什么原因导致首屏加载慢？
- 1. 网络延迟
  - 解决：
    - cdn 用户节点就近
    - preload，提前加载的资源
    - prerender
- 2. 资源太大，上 M 了，比如 2M 的 js，一般都是几十 几百 kb
  - 解决：
    - 分包 chunk
    - 懒加载
    - 缓存（强缓存（Expire、Cache-Control）、协商缓存（Last-Modified、If-Modified-Since，Etag，If-None-Match）、策略缓存（service-worker））
    - 服务端渲染 ssr
- 3. 内容渲染

### 指标衡量
- FP（First Paint 首次绘制）
- FCP（First Contentful Paint 首次内容绘制）
浏览器提供的 API 计算: PreFormance

- FMP（First Meaningful Paint）
- LCP（Largest Contentful Paint）
FMP 一般都是 Mutation Observer

- 性能采集
  - Preformance
  - Muatation Observer
- 用户行为采集
  - 无痕埋点
  - 手动埋点
  - 可视化埋点
- 异常采集
  - 异常捕获

### 具体优化细节
- 优化图片：推荐 WebP 格式，不要用太大的图片
- 组件按需加载: import 动态导入
- 延迟加载：滚动加载，可视区内容渲染
- tree-shaking：去掉无用的代码，esm 对 tree-Shaking 更加友好，因为 esm 是在编译时确定，commonjs 也可以 tree-Shaking 但比较难度较大，因为 commonjs 是运行时确定的，有很多不确定性。不过，虽然 CommonJS 进行 Tree-Shaking 难度较大，但一些打包工具（如 Webpack）也会尝试对 CommonJS 模块进行有限的 Tree - Shaking，只是效果不如 ESM 显著
- CDN
- 精简第三方库
  - 库内容要支持按需导入 babel-plugin-improt
  - 国际化文件，要移除
- 缓存
- 字体压缩
- SSR

### 具体优化细节进阶
- 预加载 preload
  - 使用 <link rel = “preload” href = “yles/main.css” as=“style”>
  - 预加载 js css 图片 字体...
- 优先加载关键CSS
  - 将关键 css 直接嵌入到 html 文件的头部，减少首次渲染的阻塞
  - <style>​/* Critical CSS */​body { margin: 0; padding: 0; font-family: Arial, sans-serif; }​</style>
- 异步加载和延迟加载 js
  - 使用 async 或 defer 属性来加载非关键的 js 文件，避免阻塞 html 解析
  - <script src="scripts/main.js" defer></script>