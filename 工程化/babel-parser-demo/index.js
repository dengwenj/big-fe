import parser from '@babel/parser' // 解析成 ast
import traverse from '@babel/traverse' // 转换 形成新的 ast
import generator from '@babel/generator' // 代码生成

const code = 'const name = pumu'

// 经过词法分析生产 ast，就是语法分析
const ast = parser.parse(code)

// 访问器
const visitor = {
  VariableDeclaration(path) {
    if (path.node.kind === 'const') {
      path.node.kind = 'var'
    }
  }
}
// 转换，语义分析
traverse.default(ast, visitor)

// 生成
const res = generator.default(ast)
console.log(res.code) // var name = pumu;

const astJSon = { "type": "File", "start": 0, "end": 17, "loc": { "start": { "line": 1, "column": 0, "index": 0 }, "end": { "line": 1, "column": 17, "index": 17 } }, "errors": [], "program": { "type": "Program", "start": 0, "end": 17, "loc": { "start": { "line": 1, "column": 0, "index": 0 }, "end": { "line": 1, "column": 17, "index": 17 } }, "sourceType": "script", "interpreter": null, "body": [{ "type": "VariableDeclaration", "start": 0, "end": 17, "loc": { "start": { "line": 1, "column": 0, "index": 0 }, "end": { "line": 1, "column": 17, "index": 17 } }, "declarations": [{ "type": "VariableDeclarator", "start": 6, "end": 17, "loc": { "start": { "line": 1, "column": 6, "index": 6 }, "end": { "line": 1, "column": 17, "index": 17 } }, "id": { "type": "Identifier", "start": 6, "end": 10, "loc": { "start": { "line": 1, "column": 6, "index": 6 }, "end": { "line": 1, "column": 10, "index": 10 }, "identifierName": "name" }, "name": "name" }, "init": { "type": "Identifier", "start": 13, "end": 17, "loc": { "start": { "line": 1, "column": 13, "index": 13 }, "end": { "line": 1, "column": 17, "index": 17 }, "identifierName": "pumu" }, "name": "pumu" } }], "kind": "var" }], "directives": [] }, "comments": [] }
