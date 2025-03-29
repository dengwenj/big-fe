// 基座
// 设计先于开发
import { registerApplication, start } from 'single-spa'
import { bootstrap as bootstrap1, mount as mount1, unmount as unmount1 } from './app1/main.js'
import { bootstrap as bootstrap2, mount as mount2, unmount as unmount2 } from './app2/main.js'

// app1
registerApplication({
  name: 'app1',
  app: {
    bootstrap: bootstrap1,
    mount: mount1,
    unmount: unmount1
  },
  activeWhen: ["/app1"]
})

// app2
registerApplication({
  name: 'app2',
  app: {
    bootstrap: bootstrap2,
    mount: mount2,
    unmount: unmount2
  },
  activeWhen: ["/app2"]
})

start()