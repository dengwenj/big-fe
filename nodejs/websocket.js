const WebSocket = require('ws');
const http = require('http');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('This is an HTTP server');
});

// 创建 WebSocket 服务器，挂载到 HTTP 服务器上
const wss = new WebSocket.Server({ noServer: true });

// 处理 HTTP 服务器的升级请求
server.on('upgrade', (request, socket, head) => {
  // 这里可以根据 URL 进行不同的处理
  if (request.url === '/pumu') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else if (request.url === '/ww') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      test(ws)
    })
  } else {
    socket.destroy();
  }
});

function test(ws) {
  console.log("进入连接 /ww")
  // 监听客户端发送的消息
  ws.on('message', (message) => {
    console.log('接收到消息: %s', message);
    // 向客户端发送响应
    ws.send(`服务器已收到消息: ${message}`);
  });

  // 监听客户端断开连接事件
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });

  let index = 0
  setInterval(() => {
    ws.send('给客户端发送消息 /ww' + index++)
  }, 3000);
}

// 监听 WebSocket 连接事件
wss.on('connection', (ws, request) => {
  console.log('客户端已通过 /ws 连接');

  // 监听客户端发送的消息
  ws.on('message', (message) => {
    console.log('接收到消息: %s', message);
    // 向客户端发送响应
    ws.send(`服务器已收到消息: ${message}`);
  });

  // 监听客户端断开连接事件
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });

  let index = 0
  setInterval(() => {
    ws.send('给客户端发送消息 /pumu' + index++)
  }, 3000);
});

// 启动 HTTP 服务器，监听 8080 端口
const port = 8080;
server.listen(port, () => {
  console.log(`服务器正在监听端口 ${port}`);
});