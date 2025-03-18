// loader 的本质就是一个函数

export default function tsFileLoader(source) {
  // 进行编译，转化一些工作 TODO
  const finallyRes = source.replace('朴睦', 'pumu')
  return finallyRes
}
