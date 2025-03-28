### Webpack 的构建流程
1. 初始化：根据webpack.config.js解析配置，进行初始化操作，比如：创建贯穿全文的 Compiler 对象，根据入口构建依赖分析图。
2. 编译：根据依赖分析图编译模块，然后在**模块的解析之后**，**构建之前**，会去执行至关重要的 loader，在 loader 中做一些列转换。
3. 构建：模块转换完之后，就要根据配置构建模块。比如说 代码分割、代码压缩、树摇，生成资源。执行插件对应的生命周期钩子(全文都会做，遇到对应的时机就会执行)。
4. 输出：根据构建好的文件，最终输出到指定位置。Webpack 会触发 compiler.hooks.done 钩子，表示构建过程完成。
TODO Vite 的构建流程



### 浏览器缓存
- 浏览器缓存是浏览器内部的一种机制，用于缓存 HTML、CSS、JS 以及图片等资源，这样可以减少服务器负担，加快页面加载速度。浏览器缓存主要分为两种类型：强缓存和弱缓存。

- 强缓存：是指浏览器在一定时间内直接从缓存中读取资源，而不发起请求到服务器。即使用户刷新页面，浏览器也不会向服务器请求资源。强缓存主要通过 HTTP 响应头中的 Expires 和 Cache-Control 字段来控制。
- 弱缓存：弱缓存则是在强缓存没有命中时，会去检查弱缓存。弱缓存也被称之为协商缓存，浏览器在请求资源时，会先发送一个请求到服务器，询问资源是否有更新。如果资源没有更新，服务器会返回 304 状态码，告诉浏览器继续使用缓存，这就是命中了弱缓存。如果资源有更新，服务器则返回新的资源内容。弱缓存主要通过 HTTP 响应头中的 Last-Modified 和 ETag 字段来控制。



### 自动注入路由
- import.meta.glob(['@/views/*/*/index.tsx', '@/views/*/index.tsx'])，生成路径和组件的映射关系
- 根据菜单模块生成的 pageUrl，菜单模块有 children，递归生成路由，根据 pageUrl 去映射表里面找对应的组件
- 菜单模块可以有同样的 pageUrl(即对应同一个组件)，只要 pageId 不相同就行，根据业务需求做不同的策略，只需要有个标识判断出哪个对应哪个就行
- 遇到一个问题就是，不同菜单使用同一个路由页面，缓存会保留第一次打开的路由页面，怎么解决？通过改变 name 的方式解决缓存问题
```ts
import { h } from "vue"

// 用来存已经创建的组件
const wrapperMap = new Map()
// 将router传个我们的组件重新换一个新的组件，原组件包里面
export default function nameDiffComponent(component: any, route: any) {
  let wrapper
  if (component) {
    const wrapperName = route.name
    if (wrapperMap.has(wrapperName)) {
      wrapper = wrapperMap.get(wrapperName)
    } else {
      wrapper = {
        // 这里写的 name 就要缓存的 name，必须要唯一，用的是 moduleCd
        // 会把页面组件里写的 name 覆盖掉
        name: wrapperName,
        render() {
          return h(component)
        },
      }
      wrapperMap.set(wrapperName, wrapper)
    }
    return h(wrapper)
  }
}

```


