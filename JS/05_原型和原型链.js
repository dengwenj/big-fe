const person = {
  name: '朴睦',
  age: 18
}

// 克隆对象
// 第一个参数是设置为 pumu 对象的原型对象
// 第二个参数是为 pumu 对象加上属性，键是属性名，值是属性描述符
// pumu 的原型对象时 person
const pumu = Object.create(person, {
  sex: {
    value: "男",
    enumerable: true // 可枚举的
  }
})
console.log(pumu.__proto__ === person) // true

const hmm = Object.create(pumu, {
  name: {
    value: '韩梅梅',
    enumerable: true
  }
})
console.log(hmm.__proto__ === pumu) // true
console.log(hmm.__proto__.__proto__ === person) // true
// 当查找一个对象的属性的时候，如果该对象上面没有这个属性，则会去该对象上面的原型对象进行查找
// Array 这是个函数，函数也是对象
console.log(Array.__proto__ === Function.prototype) // true
console.log(Function.__proto__ === Function.prototype) // true

/**
 * JS 中每个对象都有一个原型对象。可以通过 __proto__ 属性来访问到对象的原型对象
 * 构造函数的 prototype 属性指向一个对象，这个对象是该构造函数实例化出来的对象的原型对象
 * 原型对象的 constructor 属性也指向其构造函数
 * 实例对象的 constructor 属性是从它的原型对象上访问到的
 * 每个对象都有自己的原型对象，而原型对象本身也有自己的原型对象，从而形成了一条原型链
 * 每一个对象都有一个原型对象。而原型对象上面也有一个自己的原型对象，一层一层向上找，最终会到达 null
 */
function Person(name, age) {
  this.name = name
  this.age = age
}
Person.prototype.show = function () {
  console.log(this.name + this.age)
}
const p1 = new Person("朴睦", 18)
const p2 = new Person("韩梅梅", 20)
p1.show()
p2.show()
console.log(Person.__proto__ === Object.__proto__) // true，都是 Function 的原型对象
console.log(Person.__proto__ === Function.prototype) // true
console.log(p1.__proto__.__proto__.__proto__) // null
console.log(p1.__proto__ === Person.prototype) // true
