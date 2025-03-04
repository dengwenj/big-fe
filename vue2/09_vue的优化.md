## vue 优化

### 使用 key
* 对于通过循环生成的列表，应给每个列表项一个稳定且唯一的 key，这有利于在列表变动时，尽量少的删除、新增、改动元素

### 使用冻结的对象
* 冻结的对象不会被响应化

### 使用函数式组件
* 对于只读的可以使用函数式组件

### 使用计算属性
* 如果模版中某个数据会使用多次，并且该数据是通过计算得到的，使用计算属性以缓存它们

### 非实时绑定的表单项
* 当使用 v-model 绑定一个表单项时，当用户改变表单项的状态时，也会随之改变数据，从而导致 vue 发生重渲染(rerender)，这会带来一些性能开销。
* 特别是当用户改变表单项时，页面有一些动画正在进行中，由于 js 执行线程和浏览器渲染线程是互斥的，最终会导致动画出现卡顿
* 我们可以通过使用 lazy 或不使用 v-model 的方式解决该问题

### 保持对象引用稳定
* 在绝大部分情况下，vue 触发 rerender 的时机是其依赖的数据发生变化，若数据没有发生变化，哪怕给数据重新赋值了，vue 也不会做出任何处理。因此，如果需要，只要能保证组件的依赖数据不发生变化，组件就不会重新渲染。
* 对于对象类型，保持其引用不变即可

### 使用 v-show 代替 v-if
* 对于频繁切换状态的元素，使用 v-show 可以保证虚拟 dom 树的稳定，避免频繁的新增和删除元素，特别是对于那些内部包含大量 dom 元素的节点

### 使用延迟装载（defer）
* 首先白屏事时间主要受到两个因素的影响：
* 1、打包体积过大：巨型包需要消耗大量的传输时间，导致 js 传输完成前页面只有一个 div，没有可显示的内容
* 2、需要立即渲染的内容太多：js 传输完成后，浏览器开始执行 js 构造页面，但可能一开始要渲染的组件太多，不仅 js 执行的时间很长，而且执行完后浏览器要渲染的元素过多，从而导致页面白屏
* 第二个问题解决办法：**延迟装载组件，让组件按照指定的先后顺序依次一个一个渲染，不要同时全部渲染**
* 本质上就是利用 requestAnimationFrame 事件分批渲染内容

### requestAnimationFrame 
* 在 requestAnimationFrame 的上下文中，“帧” 是指浏览器进行一次完整的渲染过程，包括重排（回流）和重绘。
* 与浏览器刷新率同步：大多数显示器的刷新率为 60Hz，即每秒刷新 60 次，理想状态下每一帧的时间间隔约为 16.67ms 。requestAnimationFrame 会根据浏览器的刷新率来安排回调函数的执行，就是说差不多每隔 16.67ms 会去执行 requestAnimationFrame 里的回调函数
* requestAnimationFrame **可以分片的做一些事情（把一个大任务分成多个小任务去执行）**
```js
const list = document.getElementById('list');
// 模拟的大数据数组
const largeData = Array.from({ length: 100000 }, (_, index) => `Item ${index + 1}`);
const batchSize = 100; // 每次加载的数据数量
let currentIndex = 0;

function loadData() {
  const endIndex = Math.min(currentIndex + batchSize, largeData.length);
  for (let i = currentIndex; i < endIndex; i++) {
    const item = document.createElement('li');
    item.textContent = largeData[i];
    list.appendChild(item);
  }
  currentIndex = endIndex;

  // 如果还有数据未加载，继续请求下一帧加载
  if (currentIndex < largeData.length) {
    requestAnimationFrame(loadData);
  }
}

// 开始加载数据
requestAnimationFrame(loadData);
```