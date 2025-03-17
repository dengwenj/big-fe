import { Plugin } from 'vite'

export function VitePluginPort(): Plugin {
  return {
    name: 'vite-plugin-port',
    config(config) {
      config.server!.port = 3001
      return config
    },
  }
}
