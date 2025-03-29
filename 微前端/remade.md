- 微前端是一种类似于微服务的架构，是一种由独立交付的多个前端应用组成整体的架构风格，将前端应用分解成一些更小、更简单的能够独立开发、测试、部署的应用，而在用户看来仍然是内聚的单个产品。

### 微前端解决的问题（背景）
1. 随着项目迭代应用越来越庞大，难以维护。
2. 项目比较陈旧，业务迁移到新项目，提高开发效率、代码可维护性、性能优化等。（新业务用新的技术栈来开发，之后利用微前端接入到老项目）
3. 跨团队或跨部门协作开发项目导致效率低下的问题。

### 如何实现微前端（怎样实现）
- 我们可以将一个应用划分成若干个子应用，将子应用打包成一个个的模块。当路径切换时加载不同的子应用。这样每个子应用都是独立的，技术栈也不用做限制了。

### 实现微前端技术方案（方案选择。实现的方案）
- 采用何种方案进行应用拆分？（拆分了之后还要接入到基座）
- 采用何种方式进行应用通信？
- 应用之间如何进行隔离？
  #### 具体方案
    1. iframe
      - 微前端的最简单方案，通过 iframe 加载子应用
      - 通信可以通过 postMessage 进行通信
      - 完美的沙箱机制自带应用隔离
      - 缺点：用户体验差（弹窗只能在 iframe 中、在内部切换刷新就会丢失状态）
    2. Web Components
      - 将前端应用程序分解为自定义 HTML 元素
      - 基于 CustomEvent 实现通信
      - Shadow DOM 天生的作用域隔离
      - 缺点：浏览器支持问题、学习成本、调式困难、修改样式困难等问题
    3. single-spa
      - single-spa 通过路由劫持实现应用的加载（采用 Systemjs），提供应用间公共组件加载及公共业务逻辑处理。子应用需要暴露固定的钩子（bootstrap、mount、unmount）
      - 基于 props 主子应用间通信
      - 无沙箱机制，需要自己实现 js 沙箱以及 css 沙箱
      - 缺点：学习成本、无沙箱机制、需要对原有的应用进行改造、子应用间相同资源重复加载问题
    4. Module federation（模块联邦）
      - 通过模块联邦将组件进行打包导出使用
      - 共享模块的方式进行通过
      - 无 css 沙箱和 js 沙箱
      - 缺点：需要 webpack5

### micro-app
- **通过js沙箱、样式隔离、元素隔离、路由隔离模拟实现了ShadowDom的隔离特性(自己去实现的)，并结合CustomElement将微前端封装成一个类WebComponent组件**
- 利用了 CustomElement 的一系列钩子方法，在对应的时机做对应的事（比如在 connectedCallback 去挂载子应用）
- 使用的时 WebComponent 方案，把应用变成一个自定义元素运用进来
- **micro-app 和 wujie 核心是应用变成自定义元素，插入到基座中**
- **formHTML** 对 html 进行处理
- 执行流程
  1. 对于 micro-app，它里面的核心是创建一个 WebComponent（自定义元素 CustomElement）
  2. 获取 html，将模版放到 WebComponent 中
  3. css 做作用域隔离，js 做 proxy 沙箱（function (window){width(window)}）(proxyWindow) new Function
    - 把 link 标签请求的 css 数据，放到了 style 标签的内容中（一个 link 标签对应一个 style 标签，会添加 scoped css 隔离）
    - 把 script 标签请求的 js 数据拿到，用 new Function 的形式去执行（new Function 传入 js 字符串），做到 js 隔离(在 function 里面)，proxyWindow
    - **ProxyWindow** 本质上是基于 Proxy 对象创建的一个代理窗口对象，它的主要目的是对 window 对象的访问进行拦截和控制，进而达成 JavaScript 沙箱和部分 DOM 隔离的效果。
  4. 执行完毕后应用可以正常挂载
- micro-app 是自己实现的 css 隔离和 js 隔离
- 元素隔离：micro-app 会为每个子应用创建一个独立的虚拟 DOM 容器，子应用的所有 DOM 操作都在这个容器内部进行。这个容器就像是一个沙箱，将子应用与主应用的 DOM 隔离开来。
```js
document.querySelector = function(selector) {
  // 假设子应用的 DOM 容器是 subAppContainer
  const subAppContainer = document.getElementById('sub-app-container');
  return subAppContainer.querySelector(selector);
};
```
- 路由隔离：micro-app 通常会为每个微应用分配一个独立的路径前缀。唯一的值

### wujie
- 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <!-- 
    WebComponent：
    1. custom elements: 允许用户自定义一个元素 
    2. shadow DOM 样式隔离是 WebComponent 一部分
    3. 可以支持组件的特点 模版、插槽、生命周期、属性等等
  -->
  <my-micro id="my-micro1" name="sub1" type="primary"></my-micro>
  <my-micro id="my-micro2" name="sub2" type="primary"></my-micro>

  <div class="demo">外部样式没有生效, shadow dom 隔离</div>

  <script>
    // 模拟是从远程获取过来的
    const sub1 = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <body>
          <div class="demo">我是从远程获取过来的子应用1</div>
        </body>
      </html>
    `
    const sub2 = `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <body>
          <div class="demo">我是从远程获取过来的子应用2</div>
        </body>
      </html>
    `

    class MyMicro extends HTMLElement {
      // 自定义元素挂载后执行
      connectedCallback() {
        this.name = this.getAttribute('name')
        let innerHTML
        if (this.name === 'sub1') {
          innerHTML = sub1
        } else {
          innerHTML = sub2
        }
        console.log(`${this.name} mount...`)

        // 可以支持隔离(样式)
        this.shadow = this.attachShadow({ mode:"open" })

        this.s = {
          primary: {
            background: 'blue'
          },
          default: {
            background: 'red'
          }
        }
        const val = this.getAttribute('type')
        const styleEl = document.createElement('style')
        styleEl.innerHTML = `
          .demo {
            background: ${this.s[val].background}
          }
        `

        // 自定义事件
        this.dispatchEvent(new Event('microMount'))

        // 注入内容
        const html = document.createElement('html')
        html.innerHTML = innerHTML
        this.shadow.appendChild(html)
        // 注入样式
        this.shadow.appendChild(styleEl)
      }

      // 其他生命周期...

      // 自定义元素卸载
      disconnectedCallback() {
        console.log(`{this.name} 自定义元素卸载钩子...`)
      }

      // 哪些属性监听改变
      static get observedAttributes() {
        return ['type']
      }

      // 属性改变后触发
      attributeChangedCallback(name, oldVal, newVal) {
        if (this.shadow && name === 'type' && this.s) {
          const el = this.shadow.querySelector('.demo')
          el.style.background = this.s[newVal].background
        } 
      }
    }

    const micro1 = document.getElementById('my-micro1')
    const micro2 = document.getElementById('my-micro2')

    micro1.addEventListener('microMount', (e) => {
      console.log("microMount1...")
    })
    micro2.addEventListener('microMount', (e) => {
      console.log("microMount2...")
    })

    // 定义一个元素，名字和上面标签的名字一样
    customElements.define('my-micro', MyMicro)

    setTimeout(() => {
      micro1.setAttribute('type', 'default')
      micro2.setAttribute('type', 'default')
    }, 1000)
   </script>
</body>
</html>
```

### 微前端
- 微前端的核心概念：生命周期（初始化、挂载、卸载）
- 基座只需要关心子应用的：
  - 初始化，bootstrap
  - 挂载，mount
  - 卸载，unmount

### 微前端原理剖析
- 生命周期（子应用接入协议）
- 样式隔离
  - 工程化手段
  - 动态样式表
  - Shadow DOM
  - runtime css transformer
- 应用隔离
  - 快照沙箱
  - 代理沙箱
- 通信
  - url 机制
  - 事件机制
  - props