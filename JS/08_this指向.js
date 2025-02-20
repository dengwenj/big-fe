function fn() {
  console.log(typeof this); // function
  // this()
  console.log(this)
}
// fn()
// fn 在 window 对象上面
// fn.bind()

function foo() {
  console.log("foo")
}

fn.call(foo)
fn.call([1, 2])
// console.log(Function.prototype.call.bind(Function.prototype.bind)(fn)())

console.log("------------")
function foo(n, m) {
  console.log(n, m)
  console.log(this)
}
// bind 后面有参数就用参数里面，没有参数就用 newFoo 里的
var newFoo = foo.bind("bind", 50, 60)
newFoo()
newFoo(222, 333)

/**
 * this 的指向哪几种？
 * 在函数体中，非显示或隐式的简单调用函数时，在严格模式中，函数内的 this 会被绑定到 undefined 上，在非严格模式下则会被绑定到全局对象 window/global 上
 * 一般使用 new 方法调用构造函数时，构造函数内的 this 会被绑定到新创建的对象上
 * 一般通过 call/apply/bind 方法显示调用函数时，函数体内的 this 会被绑定到指定参数的对象上
 * 一般通过上下文对象调用函数时，函数体内的 this 会被绑定到该对象上
 * 在箭头函数中，this 的指向是由外层作用域来决定的
 */