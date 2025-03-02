const http = require('http');

const postArr = []
const getArr = []

// 创建 HTTP 服务器
const server = http.createServer()
server.on('request', (req, resp) => {
  if (req.method.toLocaleLowerCase() === 'get') {
    const item = getArr.find((it) => it.url === req.url)
    if (item) {
      item.cb(req, resp)
    } else {
      resp.end("暂无")
    }
  }
})

const post = (url, cb) => {
  postArr.push({
    url,
    cb
  })
}

const get = (url, cb) => {
  getArr.push({
    url,
    cb
  })
}

get('/html', (req, res) => {
  console.log("访问了 html")
  res.end("api is /html url")
})

post('/css', (req, res) => {
  console.log("css")
  res.end("api is /css url")
})

post('/js', (req, res) => {
  console.log("js")
  res.end("api is /js url")
})

server.listen(8000, () => {
  console.log(`服务器启动成功 8000`)
})