/**
 * 文件上传的消息格式
 * 文件上传的本质仍然是一个数据提交，无非就是数据量大一些而已
 * 除非接口文档特别说明，文件上传一般使用 post 请求
 * content-type: multipart/form-data，浏览器会自动分配一个定界符 boundary
 * 请求体的格式是一个被定界符 boundary 分割的消息，每个分割区域本质就是一个键值对
 * 除了键值对外，multipart/form-data 允许添加其他额外信息，比如文件数据区域，一般会把文件在本地的名称和文件MIME类型告诉服务器
 */

const formdata = new FormData()
formdata.append('file', 文件的数据二进制)
