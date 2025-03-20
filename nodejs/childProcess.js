const http = require('http')

const server = http.createServer()

server.on('request', (req, res) => {
  res.end("hello world")
})

server.listen(3002, () => {
  console.log("子进程里服务器启动成功")
  // console.log(process.argv)
})

setTimeout(() => {
  process.exit()
}, 3000);