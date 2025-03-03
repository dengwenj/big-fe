/**
 * 响应式数据的最终目标，是当对象本身或对象属性发生变化时，将会运行一些函数，最常见的就是 render 函数
 * 在具体实现上，vue 用到了几个核心部件：
 * 1、Observer
 * 2、Dep
 * 3、Watcher
 * 4、Scheduler
 * 
 * Observer
 * Observer 要实现的目标非常简单，就是把一个普通的对象转换为响应式的对象
 * 为了实现这一点，Observer 把对象的每个属性通过 Object.defineProperty 转换为带有 getter 和 setter 的属性，这样一来，当访问
 * 或设置属性时，vue 就有机会做一些别的事情。
 * 原始对象 -> Oberser -> 响应式对象 getter setter
 * Observer 是 vue 内部的构造器，我们可以通过 Vue 提供的静态方法 Vue.observable(object) 间接的使用该功能，Vue.observable(object) 把 object 变成一个响应式
 * 在组件生命周期中，这件事发生在 beforeCreate 之后，created 之前
 * 由于遍历时只能遍历到对象的当前属性，因此无法监测到将来动态增加或删除的属性，因此 vue 提供了 $set 和 $delete 两个实例方法，
 * 让开发者通过这两个实例方法对已有响应式对象添加或删除属性
 * 对于数组，vue 会更改它的隐式原型，之所以这样做，是因为 vue 需要监听那些可能改变数组内容的方法
 * 总之，Observer 的目标，就是要让一个对象，它属性的读取、赋值，内部数组的变化都要能够被 vue 感知到(这样 vue 才可以做其他事情)
 * 
 * Dep
 * 记录依赖：是谁在用我
 * 派发更新：我变了，我要通知哪些用到我的人
 * 
 * Watcher
 * watch 会设置一个 全局变量，让全局变量记录当前负责执行的 watcher 等于自己，然后再去执行函数，在函数的执行过程中，如果发生了
 * 依赖记录 dep.depend()，那么 Dep 就会把这个全局变量记录下来，表示有一个 watcher 用到了我这个属性
 * 当 Dep 进行派发更新时，它会通知之前记录的所有 watcher：我变了
 * 
 * Scheduler（调度器）
 * 调度器维护一个执行队列，该队列同一个 watcher 仅会存在一次，队列中的 watcher 不是立即执行，它会通过一个叫做 nextTick 的工具方法
 * 把这些需要执行的 watcher 放入到事件循环的微队列，nextTick 的具体做法是通过 Promise 完成的
 * 当响应式变化时，render 函数是异步执行的，在微队列里面
 */