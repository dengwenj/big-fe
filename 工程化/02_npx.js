/**
 * 运行本地命令
 * 使用 npx 命令时，它会首先从本地工程的 node_module/.bin 目录中寻找是否有对应的命令：
 * npm webpack
 * 上面这条命令寻找本地工程的 node_module/.bin/webpack
 * 如果将命令配置到 package.json 的 scripts 中，可以省略 npx
 * 
 * 临时下载文件
 * 当执行某个命令时，如果无法从本地工程中找到对应命令，则会把命令对应的包下载到一个临时目录，下载完成后执行，临时目录中的文件会在适当的时候删除
 * npx prettyjson 1.json，npx 会下载 prettyjson 包到临时目录，然后运行该命令。
 * 如果命令名称和需要下载的包名不一致时，可以手动指定包名：npx -p @vue/cli vue create vue-app
 */