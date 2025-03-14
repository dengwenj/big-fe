import {
  h,
} from './runtime-dom.js'

export default {
  setup() {
    return () => {
      return h('h1', '你好世界')
    }
  }
}
