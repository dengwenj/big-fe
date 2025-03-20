const childProcess = require('child_process')
const path = require('path')

const cp = childProcess.spawn('node', ['childProcess.js', 'pumu', 'ww'], {
  cwd: path.resolve(__dirname)
})

cp.stdout.on('data', (data) => {
  console.log(`子进程标准输出：\n${data.toString()}`);
});

// 监听子进程退出事件
cp.on('close', (code) => {
  console.log(`spawn 创建的子进程已退出，退出码: ${code}`);
});
