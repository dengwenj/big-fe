/**
 * json.parse(json.stringify), 不会对函数进行拷贝，因为要 json 数据结构
 * 深拷贝
 */
function deepClone(target) {
  let result

  if (typeof target === 'object') {
    // 数组
    if (Array.isArray(target)) {
      result = []
      for (const item of target) {
        result.push(deepClone(item)) 
      }
    } else if (target === null) {
      result = null
    } else {
      // 对象
      result = {}
      for (const key in target) {
        result[key] = deepClone(target[key])
      }
    }
  } else {
    result = target
  }

  return result
}

const obj = {
  name: '朴睦',
  age: 18,
  hobby: ["睡觉", "吃饭"],
  other: {
    sex: '男'
  }
}
const newObj = deepClone(obj)
newObj.other.sex = "女"
console.log(obj, 'obj')
console.log(newObj, 'newObj')
console.log(newObj.other === obj.other)

/**
 * 深拷贝和浅拷贝的区别
 * 浅拷贝：只是拷贝了基本类型的数据，而引用类型数据，拷贝的是地址，地址还是指向的同一个 
 * 深拷贝：引用类型数据，重新分配内存，地址不一样了
 */