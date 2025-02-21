const map = new Map()
map.set("name", "你好")
map.set("age", 18)
// for (const item of map.values()) {
//   console.log(item)
//   console.log(typeof item)
// }
map.forEach((val, key, map) => {
  console.log(val, key, map)
})

const wMap = new WeakMap()
wMap.set({name: "朴睦"}, { age: 18 })

const set = new Set([1, 2, 3, 3, 4, 1, 6])
set.add(5)

const wSet = new WeakSet([{ name: '' }, { age: 18 }])

/**
 * Map
 * 1、键名唯一不可重复
 * 2、类似于集合，键值对的集合，任何值都可以作为一个键或者一个值
 * 3、可以遍历，可以转换各种数据格式
 * 
 * WeakMap
 * 1、只接受对象为键名，不接受其他类型的值作为键名，键值可以是任意
 * 2、键名是弱引用，键名所指向的对象，会被垃圾回收机制回收（该对象没有被其他引用的时候，会被回收）
 * 3、不能遍历
 * 
 * Set
 * 1、成员唯一，无序且不会重复
 * 2、类似于数组，键值和键名是一致的
 * 3、可以遍历
 * 
 * WeakSet
 * 1、只能存储对象引用，不能存放值
 * 2、成员都是弱引用，会被垃圾回收机制回收
 * 3、不能遍历
 */