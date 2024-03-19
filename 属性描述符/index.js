const obj = {
  a: 1,
  b: 2
}

// 得到属性描述符
console.log(Object.getOwnPropertyDescriptor(obj, 'a')) // 返回的是个对象 { value: 1, writable: true, enumerable: true, configurable: true }

// 设置属性描述符
Object.defineProperty(obj, 'c', {
  value: 3,
  writable: false, // 不可重写
  enumerable: false, // 不可遍历
  configurable: false, // 不可修改描述符本身
})
obj.c = 4
console.log(obj.c) // 3 不可修改

let temp = undefined
Object.defineProperty(obj, 'd', {
  get() {
    return temp
  },
  set(val) {
    temp = val
  }
})
obj.d = 55555
console.log(obj.d)

class Demo {
  constructor(o) {
    Object.defineProperty(this, 'data', {
      get() {
        return o
      },
      set() {
        throw new Error('该属性不可被修改')
      }
    })
  }
}
const d = new Demo(obj)
d.data = 'hhh'
