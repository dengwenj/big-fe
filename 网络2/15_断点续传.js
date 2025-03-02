/**
 * 下载:
 * 若要实现下载时的断点续传，首先，服务器在响应时，要在头中加入下面的字段
 * Accept-Ranges: bytes
 * 这个字段是向客户端表明：我这个文件可以支持传输部分数据，你只要需要告诉我你需要的是那一部分的数据即可，单位是字节
 * 此时，某些支持断点续传的客户端，比如迅雷，它就可以在请求时，告诉服务器需要的数据范围。具体做法是在请求头中加入下面的字段
 * range: bytes=0-5000
 * 客户端告诉服务器：请求给我传递 0-5000 字节范围内的数据即可，无须传输全部数据
 * 
 * 上传:
 * 整体来说，实现断点上传的主要思路就是把要上传的文件切分为多个小的数据块然后进行上传
 * 虽然标准的不同，这也就意味着分片上传需要自行编写代码实现
 */

/**
 * 分片上传
 * @param {File} file 
 * @returns Promise
 */
async function splitFile(file) {
  return new Promise((resolve, reject) => {
    // 分片尺寸(1M)
    const chunkSize = 1024 * 1024
    // 分片数量: 文件总大小 / 分片的大小
    const chunkCount = Math.ceil(file.size / chunkSize)
    // 当前 chunk 的下标
    let chunkIndex = 0
    // 存储每片的数据
    const chunks = []
    // 使用 ArrayBuffer 完成文件 MD5 编码
    const spark = new SparkMD5.ArrayBuffer()
    // 文件读取器，读取文件数据
    const fileReader = new FileReader()
    // 数据读取完成
    fileReader.onload = (e) => {
      // 每一片的 buffer
      const buffer = e.target.result
      // 分片数据追加到文件 MD5 中
      spark.append(buffer)
      // 当前分片的 MD5。加上 chunkIndex 的原因是唯一性。可能分片有重复，导致每片的 MD5 一样，这个问题这里暂时不处理(分片重用)
      const chunkMD5 = chunkIndex + "：" + SparkMD5.ArrayBuffer.hash(buffer)
      chunks.push({
        id: chunkMD5,
        content: new Blob([buffer])
      })
      chunkIndex++
      if (chunkIndex < chunkCount) {
        // 读取下一个分片
        loadNext()
      } else {
        // 已经读取完成
        const fileId = spark.end() // 整个文件的 MD5
        resolve({
          fileId,
          chunks,
          suffix: getSuffix(file.name)
        })
      }
    }
    // 读取下一个分片
    function loadNext() {
      const start = chunkIndex * chunkSize
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }
    loadNext()

    function getSuffix(name) {
      const idx = name.lastIndexOf('.')
      if (idx !== -1) {
        return name.slice(idx)
      }
      return ''
    }
  })
}
