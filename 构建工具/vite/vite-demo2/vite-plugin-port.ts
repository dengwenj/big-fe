import { Plugin } from 'vite'

export function VitePluginPort(): Plugin {
  return {
    name: 'vite-plugin-port',
    config(config) {
      // config.server!.port = 3001
      return config
    },
    transform(code) {
      // code 是读取文件的内容
      console.log("VitePluginPort transform...")
      return code
    },
    generateBundle() {
      console.log("VitePluginPort generateBundle...")
    }
  }
}
