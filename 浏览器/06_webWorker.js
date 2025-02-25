/**
 * web worker，用户可以很容易的创建在后台运行的线程，这个线程被称之为 Worker。如果将可能消耗较长时间的处理交给后台来执行，
 * 则对用户在前台页面中执行的操作没有影响
 * 
 * web worker 的特点：
 * 1、通过加载一个 js 文件来进行大量复杂的计算，而不挂起主线程。通过 postMessage 和 onMessage 进行通信
 * 2、不能跨域加载 js
 * 3、worker 内代码不能访问 DOM
 * 4、使用 web Worker 加载数据没有 jsonp 和 ajax 加载数据高效
 * 
 * worker 的属性和方法：
 * 1、self：self 关键值用来表示本线程范围内的作用域
 * 2、postMessage()：向创建线程的源窗口发送信息
 * 3、onMessage：获取接收消息的事件句柄
 * 4、importScripts(urls)：worker 内部如果要加载其他脚本，可以使用该方法来导入其他 js 脚本文件
 */
let count = 0
setInterval(() => {
  count++
  // self.postMessage(count)
  postMessage(count)
}, 1000)

self.onmessage = function (e) {
  console.log("主线程传递过来的值👇🏻")
  console.log(e.data)
}