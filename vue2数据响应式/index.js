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
