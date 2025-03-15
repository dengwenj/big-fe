// packages/compiler-core/src/index.ts
function createParserContext(content) {
  return {
    originalSource: content,
    source: content,
    line: 1,
    column: 1,
    offset: 0
  };
}
function createRoot(children) {
  return {
    type: 0 /* ROOT */,
    children
  };
}
function isEnd(content) {
  return !content.length;
}
function backwardMoveStr(context, index) {
  let str = context.source;
  context.source = str.slice(index);
}
function parseText(context, content) {
  const arr = ["{{", "<"];
  let data;
  for (const item of arr) {
    const findIdx = content.indexOf(item);
    if (findIdx !== -1) {
      data = content.slice(0, findIdx);
      backwardMoveStr(context, findIdx);
      break;
    } else {
      data = content;
      backwardMoveStr(context, content.length - 1);
    }
  }
  return {
    type: 2 /* TEXT */,
    content: data
  };
}
function parseElement(context, content) {
}
function parserChildren(context) {
  const nodes = [];
  while (!isEnd(context.source)) {
    const content = context.source;
    let node;
    if (content.startsWith("{{")) {
    } else if (content[0] === "<") {
      node = parseElement(context, content);
    } else {
      node = parseText(context, content);
    }
    nodes.push(node);
  }
  return nodes;
}
function parse(template) {
  const context = createParserContext(template);
  return createRoot(parserChildren(context));
}
export {
  parse
};
//# sourceMappingURL=compiler-core.js.map
