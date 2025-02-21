/**
 * 函数柯里化：
 * 是把接收多个参数的函数变换成接收一个单一参数的函数，并且返回一个新函数做一系列事情，还可以继续返回函数，这个新函数使用外部的数据形成了闭包
 * 多参可以变成单参
 * 作用：
 * 1、固定参数，可以把重复写参数去掉，参数复用
 * 2、提前确认
 */

// 固定参数，可以把重复写参数去掉，参数复用
function check(reg) {
  return function(str) {
    return reg.test(str)
  }
}
const fn = check(/\d+/g)
// console.log(fn("pm2")) // true
// console.log(fn("ww")) // false

// 提前确认，就是提前确定会走哪一个方法，避免每次都进行判断
// let on = (function () {
//   if (document.addEventListener) {
//     return function(element, event, handler) {
//       element.addEventListener(event, handler, false) // false 事件委托
//     }
//   } else {
//     return function (element, event, handler) {
//       element.attachEvent('on' + event, handler)
//     }
//   }
// })()
// on(div, 'click', () => {})
// on(div, 'mouse', () => {})

// 自定义柯里化
function curry() {
  // 拿到函数
  const fn = arguments[0]
  const args = [...arguments].slice(1)

  // 说明都传递在第一个函数中
  if (args.length === fn.length) {
    return fn.apply(this, args)
  }
  // 说明传递在第一个函数里面没有传完，返回一个新函数
  function _curry() {
    args.push(...arguments)
    if (args.length === fn.length) {
      return fn.apply(this, args)
    }
    return _curry
  }
  return _curry
}

function add(a, b, c, d) {
  return a + b + c + d
}
console.log(curry(add, 1, 2, 3, 4))
console.log(curry(add, 1, 2)(3)(5))
console.log(curry(add)(1)(2, 3, 10))
