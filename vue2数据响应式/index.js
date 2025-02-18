/**
 * 数据的改变驱动页面的改变
 * 数据响应式本质：是数据变动的时候，自动去执行一些相关函数
 */
const user = {
  name: '朴睦',
  age: 25
}

obServer(user)

const nameDOM = document.querySelector('.name')
const ageDOM = document.querySelector('.age')

// 修改姓名
function updateName() {
  nameDOM.innerHTML = user.name
  ageDOM.innerHTML = user.age + 2
}

// 修改年龄
function updateAge() {
  console.log(user.age, 'user.age')
  ageDOM.innerHTML = user.age
}

autoRun(updateName)
autoRun(updateAge)

user.age = 21


// ----------------------------------
function transformObject(obj) {
  const result = {};
  // 遍历原始对象的每个键值对
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // 将键按点号分割成键路径数组
      const keyPath = key.split('.');
      let currentLevel = result;
      // 遍历键路径数组
      for (let i = 0; i < keyPath.length; i++) {
        const currentKey = keyPath[i];
        if (i === keyPath.length - 1) {
          // 如果是最后一个键，直接赋值
          currentLevel[currentKey] = value;
        } else {
          // 如果不是最后一个键，检查该键对应的对象是否存在
          if (!currentLevel[currentKey]) {
            // 若不存在，创建一个空对象
            currentLevel[currentKey] = {};
          }
          // 移动到下一层对象
          currentLevel = currentLevel[currentKey];
        }
      }
    }
  }
  return result;
}

const obj = {
  "a.b.c": 123,
  "a.b.d": 124,
  "d.a.c": 432
};

const transformedObj = transformObject(obj);
console.log(transformedObj);
