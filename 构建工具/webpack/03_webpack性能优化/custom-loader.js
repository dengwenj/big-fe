function customLoader(source) {
  return source
}

// 最开始是从这个函数执行的
customLoader.pitch = function(filePath) {
  // 如果这个返回了东西，就直接执行该 loader 了，不会往后走了
}

module.exports = customLoader
