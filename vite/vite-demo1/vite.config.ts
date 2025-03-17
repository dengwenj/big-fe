import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 本地开发服务
  server: {
    port: 3000,
    // 代理，请求转发
    proxy: {
      // 本地开发会存在跨域问题
      '/api': {
        target: 'https://cnodejs.org/api/v1', // 请求转发的地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 去掉 /api
      }
    }
  },
  // 生产构建配置
  // 所有配置都称之为数据协议，vite 数据协议
  build: {
    outDir: 'build', // 输出目录
    // 超出大小的警告
    chunkSizeWarningLimit: 200,
    // 资源目录
    assetsDir: 'assets',
    // 一般情况下都不能直接将 sourcemap 部署到生产环境，因为会暴露源码
    // sourcemap 是什么？如果不能上传到生产环境的话，怎么定位线上报错问题
    // sourcemap 可以定位到源码。用性能与异常监控平台，会托管 sourcemap 文件，通过 sourcemap 文件定位到源码
    sourcemap: true,
  },
  // 本地环境变量
  // 别名设置
  resolve: {
    alias: {
      "@": '/src'
    }
  }
})
