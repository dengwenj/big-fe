// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// // 定义要读取的 HTML 文件路径
// const filePath = path.join(__dirname, 'example.html'); // 确保 example.html 存在于当前目录下

// // 创建 HTTP 服务器
// const server = http.createServer((req, res) => {
//   // 读取 HTML 文件
//   fs.readFile(filePath, 'utf-8', (err, data) => {
//     if (err) {
//       // 如果读取失败，返回错误信息
//       res.writeHead(500, { 'Content-Type': 'text/plain' });
//       res.end('Error loading HTML file');
//       console.error('Error reading file:', err);
//       return;
//     }

//     // res.setHeader('Cache-Control', 'max-age=20')
//     res.setHeader('Cache-Control', 'no-store')
//     // 设置响应头，指定内容类型为 HTML
//     res.writeHead(200, { 'Content-Type': 'text/html' });

//     // 返回 HTML 文件内容
//     res.end(data);
//   });
// });

// // 监听端口
// const port = 4000;
// server.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const myMap = new Map();
let obj = { name: 'John' };
myMap.set('key', obj);

// 错误：创建了一个新的对象并覆盖了原来的引用
obj = { ...obj, age: 30 };
myMap.set('key', obj);
// 这里 myMap 中的对象还是原来的对象，没有新属性

// 正确：直接在 Map 中存储的对象上添加属性
// myMap.get('key').age = 30;

// 遍历 Map
myMap.forEach((value, key) => {
  console.log(`${key}:`, value);
});