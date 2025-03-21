// 配置一些插件
module.exports = {
  // 预设
  presets: [
    ['@babel/preset-env', {
      target: {
        edge: '17',
        chrome: '67'
      },
      // 按需导入
      useBuiltIns: 'usage',
      // corejs 库的版本
      corejs: '3.6.5'
    }]
  ]
}
