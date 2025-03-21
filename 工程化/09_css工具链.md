### CSS 语言
- 语法缺失（循环、判断、拼接）
- 功能缺失（颜色函数、数学函数、自定义函数）
- sass/less/stylus - css 预编译器 -> 最终编译成 css

### Postcss
- 就是处理转换逻辑，把转换的逻辑抽离出来，具体怎么去转换？靠插件去完成
- postcss 就是把一套 css 代码经过 postcss 之后转换成另一套 css 代码，可以运用各种各样的插件加进去处理具体转换
- postcss 和 js 里的 bebal 逻辑是一样的
- css -> parser -> plugin1 -> plugin2  -> transform -> newCss

### 语言层面的转换
- js babel
- css postcss

### 工程层面的转换
- 构建工具
- 脚手架
