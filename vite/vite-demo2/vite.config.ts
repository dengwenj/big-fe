import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePluginEmojiReplacer } from './vite-plugin-emoji-replacer'
import { VitePluginPort } from './vite-plugin-port'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), VitePluginEmojiReplacer(), VitePluginPort()],
})
