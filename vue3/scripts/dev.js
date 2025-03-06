// 打包脚本
import minimist from 'minimist'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import esbuild from 'esbuild'

const args = minimist(process.argv.slice(2))
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)
const target = args._[0] || 'reactivity' // 打包哪个项目
const format = args.f || 'iife' // 打包后的模块化规范
// 入口文件
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)
const packageJson = require(resolve(__dirname, `../packages/${target}/package.json`))

console.log(resolve(__dirname, `../packages/${target}/package.json`), '22')

esbuild.context({
  entryPoints: [entry], // 入口
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), // 出口
  bundle: true, // reactivity -> shared 会打包在一起
  platform: 'browser', // 打包后给浏览器使用
  sourcemap: true, // 可以调试源代码
  format,
  globalName: packageJson.buildOptions?.name
}).then((ctx) => {
  console.log('start dev');
  return ctx.watch() // 实时监控
})
