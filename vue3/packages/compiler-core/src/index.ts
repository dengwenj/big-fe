// 编译主要分为三步
// 1、需要将模版转化成 ast 语法树
// 2、转化生成 codegennode
// 3、转化成 render 函数

import { NodeTypes } from "./ast"

function createParserContext(content) {
  return {
    originalSource: content,
    source: content,
    line: 1,
    column: 1,
    offset: 0
  }
}

function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children
  }
}

function isEnd(content: string) {
  return !content.length
}

function backwardMoveStr(context, index) {
  let str = context.source
  context.source = str.slice(index)
}

function parseText(context, content: string) { // 内容   {{}}
  const arr = ['{{', '<']

  let data
  for (const item of arr) {
    const findIdx = content.indexOf(item)
    // 说明存在
    if (findIdx !== -1) {
      data = content.slice(0, findIdx)
      // 向后移动字符
      backwardMoveStr(context, findIdx)
      break
    } else {
      data = content
      // 向后移动字符
      backwardMoveStr(context, content.length - 1)
    }
  }

  return {
    type: NodeTypes.TEXT,
    content: data
  }
}

function parseElement(context, content) {
  
}

function parserChildren(context) {
  const nodes = [] as any[]

  // 没字符了退出
  while (!isEnd(context.source)) {
    const content = context.source as string

    let node
    if (content.startsWith("{{")) { // 字符串首是否存在 {{ 开头
      // 表达式
    } else if (content[0] === '<') { // 字符串首是否是 < 开头
      // 元素
      node = parseElement(context, content)
    } else { // 字符串首是否是 文本 开头
      // 文本
      node = parseText(context, content)
    }

    nodes.push(node)
  }

  return nodes
}

export function parse(template) {
  const context = createParserContext(template)

  return createRoot(parserChildren(context))
}