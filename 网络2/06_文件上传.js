 /**
  * content-type: multipart/form-data，浏览器会自动分配一个定界符 boundary
  * 请求体的格式是一个被定界符 boundary 分割的消息，每个区域本质就是一个键值对
  * 除了键值对外，multipart/form-data 允许添加其他额外信息，比如文件数据区域，一般会把文件在本地的名称和文件 MIME 类型告诉服务器
  * 
  * const formData = new FormData()
  * formData.append('file', 二进制数据 input.files[0])
  */