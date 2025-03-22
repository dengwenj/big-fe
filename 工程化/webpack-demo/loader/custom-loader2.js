/**
 * 代码转换
 */
export default function CustomLoader2(source) {
  // 返回值是一段 js 代码
  // return source
  // return `module.exports = { data: ${source} }`
  return `export default { data: ${source} }`
}
