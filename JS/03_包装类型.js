/**
 * 包装对象，就是当基本类型以对象的方式去使用时，js 会转换成对应的包装类型，相当于 new 一个对象，内容和基本类型的内容一样
 * 
 * string 是一个基本类型，但是它却能调用 charAt() 的方法
 * 其内部做的事情：
 * 1、自动创建 String 类型的一个实例（和基本类型的值不同，这个实例就是一个基本包装类型的对象）
 * 2、调用实例上指定的方法
 * 3、销毁这个实例
 */
var str = "hello"
str.charAt(0)
// var str = new String("hello")
// str.charAt(0)
// str = null

var num = new Number(1)

var bool = new Boolean(false)

var n = 1
Number.prototype.test = "test"
console.log(n.test) // test