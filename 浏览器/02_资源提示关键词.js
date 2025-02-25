/**
 * 性能优化
 * CSSOM 没构建好，可能会阻塞 JS 的执行，因为 JS 里可能会用 CSSOM 树，而 CSSOM 树还没有，所以就会等待。
 * 所以最佳的是：顶部样式、底部脚本
 * 
 * 同步的话是遇到 script 标签位置，就会停止 HTML 解析，等 js 文件下载好后执行 js
 * 
 * 1、async
 * async 表示加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行。
 * 也就是说下载 js 文件的时候不会阻塞 DOM 树的构建，但是执行该 js 代码会阻塞 DOM 树的构建
 * <script async scr="script.js"></script>
 * 
 * 2、defer
 * defer 表示加载后续文档元素的过程将和 script.js  的加载并行进行，但是 script.js 的执行要在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成。
 * 也就是说。下载 js 文件的时候不会阻塞 DOM 树的构建，然后等待 DOM 树构建完毕后再执行此 js 文件
 * <script defer scr="script.js"></script>
 * 
 * 3、preload
 * 它通过声明向浏览器声明一个需要提前加载的资源，当资源真正被使用的时候立即执行，就无需等待网络的消耗
 * <link rel="stylesheet" href="style2.css"></link>
 * <script src="main2.js"></script>
 * <link rel="preload" href="style1.css" as="style"></link>
 * <link rel="preload" href="main1.js" as="script"></link>
 * 在上面的代码中，会先加载 style1.css 和 main1.js 文件(但不会生效执行)，在随后的页面渲染中，一旦需要使用它们，它们就会立即可用
 * 总的来说，rel="preload" 预加载提供了更主动、精确的资源加载控制，而浏览器自动预加载线程则是一种基于经验和规则的自动优化机制，
 * 两者相互补充，共同提升页面的加载性能。手动加的优先级更高
 * 
 * 4、prefetch
 * prefetch 是一种利用浏览器的空闲时间加载页面将来可能用到的资源的一种机制，通常可以用于加载非首页的其他页面所需要的资源，以便加快后续页面的首屏速度
 * <link rel="prefetch" href="/ww.css" as="style"></link>
 * prefetch 加载的资源可以获取非当前页面所需要的资源
 * 
 * DNS prefetching 允许浏览器在用户浏览时在后台对页面执行 DNS 查找，这最大限度的减少了延迟
 * <link rel="dns-prefetch" href="ww.com"></link>
 * 
 * 5、prerender
 * prerender 和 prefetch 非常相似，prerender 同样也会收集用户接下来可能会用到的资源。
 * 不同之处在于 prerender 实际上是在后台渲染整个页面
 * <link rel="prerender" href="ww.com"></link>
 * 
 * 6、preconnect
 * preconnect 指令允许浏览器在 HTTP 请求实际发送到服务器之前设置早期连接，就是提前建立连接，省去时间
 * <link href="https://cdn.ww.com" rel="preconnect" crossorigin></link>
 * 如果当前页面 host 不同于 href 属性中的 host，那么将不会带上 cookie，如果希望带上 cookie 等信息，可以加上 crossorigin 属性
 */