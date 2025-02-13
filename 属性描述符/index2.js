const obj = {
  name: '朴睦',
  age: 25
}
console.log(Object.getOwnPropertyDescriptor(obj, 'name'))

class Demo {
  constructor(obj1) {
    obj1 = { ...obj1 }
    // 冻结 obj1 不能增删改obj1
    Object.freeze(obj1)
    Object.defineProperty(this, 'data', {
      configurable: false,
      get() {
        return obj1
      },
      set(val) {
        throw new Error(`data 属性不允许被修改${val}`)
      }
    })

    let c = 0
    Object.defineProperty(this, 'count', {
      configurable: false,
      get() {
        return c
      },
      set(val) {
        c = val
      }
    })

    this.a = 1
    // 密封，不能新增属性，删除属性，可以修改
    Object.seal(this)
  }
}

const d = new Demo(obj)
console.log(d.data)
d.count = 2
console.log(d.count)