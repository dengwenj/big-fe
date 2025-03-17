import { Plugin } from 'vite'

let ids: string[] = []
export function VitePluginEmojiReplacer(): Plugin {
  return {
    name: 'vite-plugin-emoji-replacer',
    // 文件都会去读取一遍，读取一遍调用 transform
    transform(code, id) {
      // code 是读取文件的内容
      let finallyCode = code
      if (id.includes('App.vue')) {
        finallyCode = code.replace(/:smiley:/g, '😄') 
        ids.push(id)
        console.log(ids, ids.length)
      }
      return finallyCode
    },
    transformIndexHtml(html, ctx) {
      console.log(html) // index.html
      // console.log(ctx)
      console.log("--------------")
    }
  }
}
