/**
 * 1、强制转换（显式转换）
 * Number()：使用 Number 函数，可以将任意类型的值转换成数值
 * Number(123) -> 123
 * Number('123') -> 123
 * Number('123abc') -> NaN
 * Number('') -> 0
 * Number(true) -> 1
 * Number(false) -> 0
 * Number(undefined) -> NaN
 * Number(null) -> 0
 * Number 方法的参数是对象时，将返回 NaN，除非是包含单个数值的数组
 * 第一步：调用对象自身的 valueOf 方法，如果返回原始类型的值，则直接对该值使用 Number 函数，不再进行后续步骤
 * 第二步：如果 valueOf 方法返回的还是对象，则改为调用对象自身的 toString 方法，如果 toString 方法返回原始类型的值，则对该值使用 Number 函数，不再进行后续步骤
 * 
 * String()：String 函数可以将任意类型的值转换成字符串
 * String 方法的参数如果是对象，返回一个类型字符串，如果是数组，返回该数组的字符串形式
 * 1、先调用对象自身的 toString 方法，如果返回原始类型的值，则对该值使用 String 函数，不再进行以下步骤
 * 2、如果 toString 方法返回的是对象，再调用原对象的 valueOf 方法，如果 valueOf 方法返回原始类型的值，则对该值使用 String 函数，不再进行以下步骤。
 * 3、如果 valueOf 方法返回的是对象，就报错
 * 
 * Boolean()：可以将可以将任意类型的值转换成布尔值，undefined、null、0、NaN、'',这 5 个转为 false，其他全为 true
 * 
 * 2、自动转换（隐式转换）
 */

console.log(typeof NaN); // number 类型

const obj = {
  name: 'pumu'
}
console.log(obj.valueOf())
console.log(typeof obj.valueOf())
console.log(typeof obj.toString())

const arr = [1]
console.log(arr.valueOf())
console.log(arr.toString())