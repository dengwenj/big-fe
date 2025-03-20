/**
 * 发布订阅
 */
class EventEmitter {
  constructor() {
    // key 存的是事件名，val 存的是数组 元素是回调函数
    this.event = {}
  }

  on(type, cb) {
    if (this.event[type]) {
      this.event[type].push(cb)
    } else {
      this.event[type] = [cb]
    }
  }

  emit(type, ...args) {
    if (!this.event[type]) {
      return
    }

    for (const cb of this.event[type]) {
      cb.call(this, ...args)
    }
  }

  once(type, cb) {
    const wrap = (...args) => {
      cb.call(this, ...args)
      this.off(type, wrap)
    }
    this.on(type, wrap)
  }

  off(type, cb) {
    if (!this.event[type]) {
      return
    }
    // 删除掉 cb
    this.event[type] = this.event[type].filter((item) => item !== cb)

    if (this.event[type].length === 0) {
      delete this.event[type]
    }
  }
}

const e = new EventEmitter()

const first = (a, b, c) => {
  console.log('第一个的：' + a, b, c)
}
e.on('pumu', first)

e.on('pumu', (a, b, c) => {
  console.log('第二个的：' + a, b, c)
})

e.once('pumu', (a, b, c) => {
  console.log('once：' + a, b, c)
})

e.emit('pumu', 'a', 'b', 'c')
e.off('pumu', first)
e.emit('pumu', 'd', 'w', 'j')
